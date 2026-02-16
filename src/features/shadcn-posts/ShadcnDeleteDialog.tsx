"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/shadcn/dialog";
import { Button } from "@/components/shadcn/button";
import { useDeletePost } from "@/features/posts/hooks/usePosts";

interface ShadcnDeleteDialogProps {
    postId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ShadcnDeleteDialog({ postId, open, onOpenChange }: ShadcnDeleteDialogProps) {
    const deletePost = useDeletePost();

    const handleDelete = async () => {
        if (postId) {
            try {
                await deletePost.mutateAsync(postId);
                onOpenChange(false);
            } catch (error) {
                console.error("Failed to delete post", error);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this post? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deletePost.isPending}
                    >
                        {deletePost.isPending ? "Deleting..." : "Delete Post"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
