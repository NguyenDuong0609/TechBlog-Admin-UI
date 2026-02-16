"use client";

import { useState } from "react";
import { usePostList } from "@/features/posts/hooks/usePosts";
import { PageHeader } from "@/components/common";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ShadcnPostsDataTable } from "@/features/shadcn-posts/ShadcnPostsDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/shadcn/dialog";
import { ShadcnPostForm } from "@/features/shadcn-posts/ShadcnPostForm";
import { ShadcnDeleteDialog } from "@/features/shadcn-posts/ShadcnDeleteDialog";

export default function ShadcnPostsPage() {
    const { data: posts, isLoading } = usePostList();

    // States for modals
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<any>(null);

    const handleEdit = (post: any) => {
        setSelectedPost(post);
        setIsFormOpen(true);
    };

    const handleDelete = (post: any) => {
        setSelectedPost(post);
        setIsDeleteOpen(true);
    };

    const handleCreate = () => {
        setSelectedPost(null);
        setIsFormOpen(true);
    };

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => (
                <div className="font-medium max-w-[300px] truncate">
                    {row.getValue("title")}
                </div>
            ),
        },
        {
            accessorKey: "published",
            header: "Status",
            cell: ({ row }) => {
                const published = row.getValue("published");
                return (
                    <Badge variant={published ? "default" : "secondary"}>
                        {published ? "Published" : "Draft"}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }) => formatDate(row.getValue("createdAt")),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)}>
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(row.original)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <PageWrapper>
            <PageHeader
                title="Shadcn Posts"
                description="Manage your posts using Shadcn UI components"
                actions={
                    <Button onClick={handleCreate}>
                        Add New Post
                    </Button>
                }
            />

            <div className="mt-6">
                {isLoading ? (
                    <div className="text-center py-10">Loading posts...</div>
                ) : (
                    <ShadcnPostsDataTable
                        columns={columns}
                        data={(posts as any[]) || []}
                    />
                )}
            </div>

            {/* Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{selectedPost ? "Edit Post" : "Create New Post"}</DialogTitle>
                    </DialogHeader>
                    <ShadcnPostForm
                        post={selectedPost}
                        onSuccess={() => setIsFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <ShadcnDeleteDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                postId={selectedPost?.id || null}
            />
        </PageWrapper>
    );
}
