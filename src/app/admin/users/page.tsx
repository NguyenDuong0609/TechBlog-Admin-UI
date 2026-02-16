"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {
    Card,
    Button,
    Input,
    Badge,
    Avatar,
    Table,
    Pagination,
    Select,
    Modal,
    type TableColumn,
} from "@/components/ui";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
// import { mockUsers } from "@/features/users/mock";
// import { User, UserRole, UserStatus } from "@/features/users/types";
import { formatDate } from "@/lib/utils";
import { Users, Plus, Search, Filter, Edit, Mail, Trash2, Loader2, Shield, FileText } from "lucide-react";
import { useUserList, useCreateUser, useUpdateUser, useDeleteUser } from "@/features/users/hooks/useUsers";
import { User } from "@prisma/client";
import { CardBody } from "@/components/ui/Card";

// Extended interface for UI
interface UserWithCount extends User {
    postCount?: number;
    // status and role are strings in Prisma, but we can type them strictly if we want
}

/**
 * Role filter options
 */
const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "ADMIN", label: "Admin" },
    { value: "USER", label: "User" },
];

/**
 * Status filter options (Prisma only has Strings usually, unless Enums used)
 * Assuming simplified for now or matching Prisma Enums if defined.
 * If Prisma User model has specific Enums, we should use them.
 * For now, I'll use simple strings matching what might be in DB or default.
 */
const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
];

/**
 * Users management page
 */
export default function UsersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Queries
    const { data: usersData, isLoading, error } = useUserList();
    const users = (usersData as UserWithCount[]) || [];

    // Mutations
    const createUserMutation = useCreateUser();
    const updateUserMutation = useUpdateUser();
    const deleteUserMutation = useDeleteUser();

    // Modal states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserWithCount | null>(null);
    const [deletingUser, setDeletingUser] = useState<UserWithCount | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "USER", // Default
        // status: "active", // Not in schema explicitly? Or is it? 
        // Checking schema: id, email, name, role (String @default("user")), createdAt, updatedAt. 
        // No status in Schema provided in summary. I will omit status for now or treat as mock.
    });

    // Handlers
    const handleOpenCreate = () => {
        setEditingUser(null);
        setFormData({
            name: "",
            email: "",
            role: "USER",
        });
        setIsFormOpen(true);
    };

    const handleOpenEdit = (user: UserWithCount) => {
        setEditingUser(user);
        setFormData({
            name: user.name || "", // name is nullable in some prisma setups, handle safely
            email: user.email,
            role: user.role,
        });
        setIsFormOpen(true);
    };

    const handleOpenDelete = (user: UserWithCount) => {
        setDeletingUser(user);
        setIsDeleteOpen(true);
    };

    const handleSubmit = async () => {
        try {
            if (editingUser) {
                // Update logic
                await updateUserMutation.mutateAsync({
                    id: editingUser.id,
                    data: formData // Valid because partial update
                });
            } else {
                // Create logic
                await createUserMutation.mutateAsync(formData);
            }
            setIsFormOpen(false);
        } catch (error) {
            console.error("Failed to save user", error);
        }
    };

    const handleDelete = async () => {
        if (deletingUser) {
            try {
                await deleteUserMutation.mutateAsync(deletingUser.id);
                setIsDeleteOpen(false);
                setDeletingUser(null);
            } catch (error) {
                console.error("Failed to delete user", error);
            }
        }
    };

    // Filter users
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            (user.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        // Status filter ignored as status is not in schema
        return matchesSearch && matchesRole;
    });

    // Paginate
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const columns: TableColumn<UserWithCount>[] = [
        {
            key: "name",
            header: "User",
            render: (_, user) => (
                <div className="flex items-center gap-3">
                    <Avatar name={user.name || "User"} size="md" />
                    <div>
                        <p className="font-medium text-slate-800">{user.name || "Unnamed"}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "role",
            header: "Role",
            render: (value) => {
                const roleVariant: Record<string, "danger" | "primary" | "default"> = {
                    ADMIN: "danger",
                    EDITOR: "primary",
                    USER: "default",
                };
                const roleLabels: Record<string, string> = {
                    ADMIN: "Administrator",
                    EDITOR: "Editor",
                    USER: "Regular User",
                };
                return (
                    <Badge
                        variant={roleVariant[value as string] || "default"}
                        size="sm"
                        className="px-2.5 py-1"
                    >
                        {roleLabels[value as string] || String(value)}
                    </Badge>
                );
            },
        },
        // Status column removed
        {
            key: "postCount",
            header: "Posts",
            align: "center",
            render: (value) => (
                <div className="flex items-center justify-center gap-1.5">
                    <FileText size={14} className="text-slate-400" />
                    <span className="font-semibold text-slate-700">{String(value || 0)}</span>
                </div>
            ),
        },
        // Last Login removed (not in schema)
        {
            key: "actions",
            header: "",
            width: "140px",
            render: (_, user) => (
                <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" icon={Edit} onClick={() => handleOpenEdit(user)}>
                        Edit
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleOpenDelete(user)}
                        disabled={deleteUserMutation.isPending}
                    />
                </div>
            ),
        },
    ];

    if (isLoading) {
        return (
            <div className="flex bg-white h-96 items-center justify-center rounded-xl shadow-sm border border-slate-100">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                    <p className="text-sm text-slate-500 font-medium">Loading users...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex bg-white h-96 items-center justify-center rounded-xl shadow-sm border border-slate-100">
                <div className="flex flex-col items-center gap-3">
                    <p className="text-slate-800 font-medium">Failed to load users</p>
                    <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <PageWrapper className="space-y-6">
            <PageHeader
                title="Users"
                description="Manage user accounts and permissions"
                icon={Users}
                breadcrumbs={[
                    { label: "Admin", href: "/admin/dashboard" },
                    { label: "Users" },
                ]}
                actions={
                    <Button icon={Plus} onClick={handleOpenCreate}>New User</Button>
                }
            />

            {/* Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                <Card className="relative overflow-hidden">
                    <CardBody className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Users</p>
                            <p className="text-2xl font-bold text-slate-800">{users.length}</p>
                        </div>
                    </CardBody>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
                </Card>
                <Card className="relative overflow-hidden">
                    <CardBody className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                            <Mail size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Active Emails</p>
                            <p className="text-2xl font-bold text-slate-800">
                                {users.filter(u => u.email).length}
                            </p>
                        </div>
                    </CardBody>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500" />
                </Card>
                <Card className="relative overflow-hidden">
                    <CardBody className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                            <Badge variant="warning" size="sm" className="absolute top-2 right-2">New</Badge>
                            <Shield size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Admins</p>
                            <p className="text-2xl font-bold text-slate-800">
                                {users.filter(u => u.role === "ADMIN").length}
                            </p>
                        </div>
                    </CardBody>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search users by name or email..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            leftIcon={Search}
                            fullWidth
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Select
                            options={roleOptions}
                            value={roleFilter}
                            onChange={(val) => {
                                setRoleFilter(val);
                                setCurrentPage(1);
                            }}
                            className="w-40"
                        />
                        <Button variant="outline" icon={Filter}>
                            More Filters
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Users Table */}
            {filteredUsers.length === 0 ? (
                <Card>
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <Users size={32} className="text-slate-300" />
                        </div>
                        <p className="text-slate-700 font-medium mb-1">No users found</p>
                        <p className="text-sm text-slate-500">
                            Try adjusting your filters or search query.
                        </p>
                    </div>
                </Card>
            ) : (
                <Card noPadding>
                    <Table
                        columns={columns}
                        data={paginatedUsers}
                        keyExtractor={(user) => user.id}
                        emptyMessage="No users found"
                    />
                    {totalPages > 1 && (
                        <div className="p-4 border-t border-slate-100">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                totalItems={filteredUsers.length}
                                itemsPerPage={itemsPerPage}
                            />
                        </div>
                    )}
                </Card>
            )}

            {/* Create/Edit User Modal */}
            <Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingUser ? "Edit User" : "Create User"}
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={createUserMutation.isPending || updateUserMutation.isPending}
                        >
                            {createUserMutation.isPending || updateUserMutation.isPending ? "Saving..." : (editingUser ? "Save Changes" : "Create Member")}
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <Input
                        label="Full Name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="John Doe"
                        fullWidth
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, email: e.target.value }))
                        }
                        placeholder="john@example.com"
                        fullWidth
                    />
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Role</label>
                        <Select
                            options={roleOptions.filter(o => o.value !== 'all')}
                            value={formData.role}
                            onChange={(val) => setFormData(prev => ({ ...prev, role: val }))}
                            fullWidth
                        />
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmDeleteModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                itemName={deletingUser?.name || "User"}
            />
        </PageWrapper>
    );
}
