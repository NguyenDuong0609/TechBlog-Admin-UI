"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {
    Card,
    Button,
    Input,
    Badge,
    Table,
    Pagination,
    Modal,
    type TableColumn,
} from "@/components/ui";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { formatDate } from "@/lib/utils";
import { FolderOpen, Plus, Search, Edit, Trash2, Loader2 } from "lucide-react";
import {
    useCategoryList,
    useCreateCategory,
    useUpdateCategory,
    useDeleteCategory
} from "@/features/categories/hooks/useCategories";
import { Category } from "@prisma/client";
import { CardBody } from "@/components/ui/Card";

// Extended interface for UI
interface CategoryWithCount extends Category {
    postCount: number;
}

/**
 * Categories management page
 */
export default function CategoriesPage() {
    const [searchQuery, setSearchQuery] = useState("");

    // Queries
    const { data: categoriesData, isLoading, error } = useCategoryList();
    const categories = (categoriesData as CategoryWithCount[]) || [];

    // Mutations
    const createCategoryMutation = useCreateCategory();
    const updateCategoryMutation = useUpdateCategory();
    const deleteCategoryMutation = useDeleteCategory();

    // Modal states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<CategoryWithCount | null>(null);

    // Form state - Description removed as it's not in schema
    const [formData, setFormData] = useState({ name: "" });

    // Filter
    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handlers
    const handleOpenCreate = () => {
        setEditingCategory(null);
        setFormData({ name: "" });
        setIsFormOpen(true);
    };

    const handleOpenEdit = (category: CategoryWithCount) => {
        setEditingCategory(category);
        setFormData({ name: category.name });
        setIsFormOpen(true);
    };

    const handleOpenDelete = (category: CategoryWithCount) => {
        setDeletingCategory(category);
        setIsDeleteOpen(true);
    };

    const handleSubmit = async () => {
        const slug = formData.name.toLowerCase().replace(/\s+/g, "-");

        try {
            if (editingCategory) {
                // Update logic
                await updateCategoryMutation.mutateAsync({
                    id: editingCategory.id,
                    data: { name: formData.name, slug } // Simple slug update
                });
            } else {
                // Create logic
                await createCategoryMutation.mutateAsync({
                    name: formData.name,
                    slug
                });
            }
            setIsFormOpen(false);
        } catch (error) {
            console.error("Failed to save category", error);
            // Show toast
        }
    };

    const handleDelete = async () => {
        if (deletingCategory) {
            try {
                await deleteCategoryMutation.mutateAsync(deletingCategory.id);
                setIsDeleteOpen(false);
                setDeletingCategory(null);
            } catch (error) {
                console.error("Failed to delete category", error);
            }
        }
    };

    const columns: TableColumn<CategoryWithCount>[] = [
        {
            key: "name",
            header: "Name",
            render: (_, category) => (
                <div>
                    <p className="font-medium text-slate-800">{category.name}</p>
                    <p className="text-sm text-slate-500">/{category.slug}</p>
                </div>
            ),
        },
        // Description column removed
        {
            key: "postCount",
            header: "Posts",
            align: "center",
            render: (value) => (
                <Badge variant="primary">{String(value || 0)}</Badge>
            ),
        },
        // UpdatedAt column removed if not in schema, or check if it exists
        /*
        {
            key: "updatedAt",
            header: "Updated",
            align: "right",
            render: (value) => value ? formatDate(value as string) : "—",
        },
        */
        {
            key: "actions",
            header: "",
            width: "120px",
            render: (_, category) => (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit}
                        onClick={() => handleOpenEdit(category)}
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleOpenDelete(category)}
                        disabled={deleteCategoryMutation.isPending}
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
                    <p className="text-sm text-slate-500 font-medium">Loading categories...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex bg-white h-96 items-center justify-center rounded-xl shadow-sm border border-slate-100">
                <div className="flex flex-col items-center gap-3">
                    <p className="text-slate-800 font-medium">Failed to load categories</p>
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
                title="Categories"
                description="Organize your posts with categories"
                icon={FolderOpen}
                breadcrumbs={[
                    { label: "Admin", href: "/admin/dashboard" },
                    { label: "Categories" },
                ]}
                actions={
                    <Button icon={Plus} onClick={handleOpenCreate}>
                        New Category
                    </Button>
                }
            />

            {/* Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                <Card className="relative overflow-hidden">
                    <CardBody className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                            <FolderOpen size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Categories</p>
                            <p className="text-2xl font-bold text-slate-800">{categories.length}</p>
                        </div>
                    </CardBody>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
                </Card>
                <Card className="relative overflow-hidden">
                    <CardBody className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                            <Plus size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Most Used</p>
                            <p className="text-2xl font-bold text-slate-800 truncate max-w-[120px]">
                                {categories.sort((a, b) => b.postCount - a.postCount)[0]?.name || "None"}
                            </p>
                        </div>
                    </CardBody>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500" />
                </Card>
                <Card className="relative overflow-hidden">
                    <CardBody className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                            <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 flex items-center justify-center">
                                <span className="text-lg font-bold">
                                    {categories.reduce((acc, cat) => acc + (cat.postCount || 0), 0)}
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Posts Count</p>
                            <p className="text-xs text-slate-400">Linked to categories</p>
                        </div>
                    </CardBody>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
                </Card>
            </div>

            {/* Search */}
            <Card>
                <div className="max-w-md">
                    <Input
                        placeholder="Search categories by name or slug..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={Search}
                        fullWidth
                    />
                </div>
            </Card>

            {/* Categories Table */}
            {filteredCategories.length === 0 ? (
                <Card>
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <FolderOpen size={32} className="text-slate-300" />
                        </div>
                        <p className="text-slate-700 font-medium mb-1">No categories found</p>
                        <p className="text-sm text-slate-500">
                            {categories.length === 0 ? "Create your first category to get started." : "Try adjusting your search query."}
                        </p>
                    </div>
                </Card>
            ) : (
                <Card noPadding>
                    <Table
                        columns={columns}
                        data={filteredCategories}
                        keyExtractor={(cat) => cat.id}
                        emptyMessage="No categories found"
                    />
                </Card>
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingCategory ? "Edit Category" : "Create Category"}
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                        >
                            {createCategoryMutation.isPending || updateCategoryMutation.isPending ? "Saving..." : (editingCategory ? "Save Changes" : "Create")}
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <Input
                        label="Name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="Category name"
                        fullWidth
                    />
                    {/* Description field removed */}
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmDeleteModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                itemName={deletingCategory?.name}
            />
        </PageWrapper>
    );
}