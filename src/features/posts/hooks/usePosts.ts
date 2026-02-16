import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postsApi } from "@/lib/api/posts.api";
import { Post } from "@prisma/client";

export function usePostList() {
    return useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const response = await postsApi.getAll();
            return response.data;
        },
    });
}

export function usePostDetail(id: string) {
    return useQuery({
        queryKey: ["posts", id],
        queryFn: async () => {
            const response = await postsApi.getById(id);
            return response.data;
        },
        enabled: !!id,
    });
}

export function useCreatePost() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await postsApi.create(data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });
}

export function useUpdatePost() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await postsApi.update(id, data);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["posts", data.id] });
        },
    });
}

export function useDeletePost() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await postsApi.delete(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });
}
