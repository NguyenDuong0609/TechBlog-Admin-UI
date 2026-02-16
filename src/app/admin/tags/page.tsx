"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardBody, Button, Input, Modal } from "@/components/ui";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { cn } from "@/lib/utils";
import { Tags, Plus, Search, Edit, Trash2, X, Loader2 } from "lucide-react";
import { useTagList, useCreateTag, useUpdateTag, useDeleteTag } from "@/features/tags/hooks/useTags";
import { Tag } from "@prisma/client";

// Extended interface for UI
interface TagWithCount extends Tag {
    postCount: number;
    // color?: string; // Not in schema, let's generate it or ignore
}

/**
 * Helper to generate consistent color from string
 */
function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
}

/**
 * Tags management page
 */
export default function TagsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    // Queries
    const { data: tagsData, isLoading, error } = useTagList();
    const tags = (tagsData as TagWithCount[]) || [];

    // Mutations
    const createTagMutation = useCreateTag();
    const updateTagMutation = useUpdateTag();
    const deleteTagMutation = useDeleteTag();

    // Modal states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<TagWithCount | null>(null);
    const [deletingTag, setDeletingTag] = useState<TagWithCount | null>(null);

    // Form state - Color removed from direct editing but could be supported if schema updated
    const [formData, setFormData] = useState({ name: "" });

    const filteredTags = tags.filter((tag) =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handlers
    const handleOpenCreate = () => {
        setEditingTag(null);
        setFormData({ name: "" });
        setIsFormOpen(true);
    };

    const handleOpenEdit = (tag: TagWithCount) => {
        setEditingTag(tag);
        setFormData({ name: tag.name });
        setIsFormOpen(true);
    };

    const handleOpenDelete = (tag: TagWithCount) => {
        setDeletingTag(tag);
        setIsDeleteOpen(true);
    };

    const handleSubmit = async () => {
        const slug = formData.name.toLowerCase().replace(/\s+/g, "-");

        try {
            if (editingTag) {
                // Update logic
                await updateTagMutation.mutateAsync({
                    id: editingTag.id,
                    data: { name: formData.name, slug }
                });
            } else {
                // Create logic
                await createTagMutation.mutateAsync({
                    name: formData.name,
                    slug
                });
            }
            setIsFormOpen(false);
        } catch (error) {
            console.error("Failed to save tag", error);
        }
    };

    const handleDelete = async () => {
        if (deletingTag) {
            try {
                await deleteTagMutation.mutateAsync(deletingTag.id);
                setIsDeleteOpen(false);
                setDeletingTag(null);
            } catch (error) {
                console.error("Failed to delete tag", error);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex bg-white h-96 items-center justify-center rounded-xl shadow-sm border border-slate-100">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                    <p className="text-sm text-slate-500 font-medium">Loading tags...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex bg-white h-96 items-center justify-center rounded-xl shadow-sm border border-slate-100">
                <div className="flex flex-col items-center gap-3">
                    <p className="text-slate-800 font-medium">Failed to load tags</p>
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
                title="Tags"
                description="Manage tags for your blog posts"
                icon={Tags}
                breadcrumbs={[
                    { label: "Admin", href: "/admin/dashboard" },
                    { label: "Tags" },
                ]}
                actions={
                    <Button icon={Plus} onClick={handleOpenCreate}>
                        New Tag
                    </Button>
                }
            />

            {/* Search */}
            <Card>
                <div className="max-w-md">
                    <Input
                        placeholder="Search tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={Search}
                        fullWidth
                    />
                </div>
            </Card>

            {/* Tags Cloud */}
            <Card>
                <CardBody>
                    <div className="flex flex-wrap gap-3">
                        {filteredTags.map((tag) => (
                            <div
                                key={tag.id}
                                className={cn(
                                    "group relative inline-flex items-center gap-2",
                                    "px-4 py-2.5 rounded-xl",
                                    "bg-white border border-slate-200",
                                    "shadow-sm hover:shadow-md",
                                    "transition-all duration-200",
                                    "hover:-translate-y-0.5"
                                )}
                            >
                                <span
                                    className="w-3 h-3 rounded-full ring-2 ring-white shadow-sm"
                                    style={{ backgroundColor: stringToColor(tag.name) }}
                                />
                                <span className="font-medium text-slate-700">{tag.name}</span>
                                <span className="text-sm text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                    {tag.postCount || 0}
                                </span>
                                {/* Actions on hover */}
                                <div
                                    className={cn(
                                        "absolute -top-2 -right-2",
                                        "flex items-center gap-1",
                                        "opacity-0 group-hover:opacity-100",
                                        "transition-opacity duration-200"
                                    )}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenEdit(tag);
                                        }}
                                        className={cn(
                                            "p-1 rounded-full",
                                            "bg-white border border-slate-200 shadow-sm",
                                            "text-slate-400 hover:text-blue-600",
                                            "transition-colors duration-200"
                                        )}
                                    >
                                        <Edit size={12} />
                                    </button>
                                    <button
                                        disabled={deleteTagMutation.isPending}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenDelete(tag);
                                        }}
                                        className={cn(
                                            "p-1 rounded-full",
                                            "bg-white border border-slate-200 shadow-sm",
                                            "text-slate-400 hover:text-red-600",
                                            "transition-colors duration-200"
                                        )}
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {filteredTags.length === 0 && (
                        <div className="text-center py-12">
                            <Tags className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500">No tags found</p>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardBody className="text-center">
                        <p className="text-3xl font-bold text-slate-800">{tags.length}</p>
                        <p className="text-sm text-slate-500">Total Tags</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="text-center">
                        <p className="text-3xl font-bold text-slate-800">
                            {tags.reduce((acc, tag) => acc + (tag.postCount || 0), 0)}
                        </p>
                        <p className="text-sm text-slate-500">Total Uses</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="text-center">
                        <p className="text-3xl font-bold text-slate-800">
                            {tags.length > 0
                                ? Math.round(
                                    tags.reduce((acc, tag) => acc + (tag.postCount || 0), 0) / tags.length
                                )
                                : 0}
                        </p>
                        <p className="text-sm text-slate-500">Avg Posts/Tag</p>
                    </CardBody>
                </Card>
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingTag ? "Edit Tag" : "Create Tag"}
                size="sm"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={createTagMutation.isPending || updateTagMutation.isPending}
                        >
                            {createTagMutation.isPending || updateTagMutation.isPending ? "Saving..." : (editingTag ? "Save Changes" : "Create")}
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
                        placeholder="Tag name"
                        fullWidth
                    />
                    {/* Color picker removed */}
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmDeleteModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                itemName={deletingTag?.name}
            />
        </PageWrapper>
    );
}
