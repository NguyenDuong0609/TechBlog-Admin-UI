import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tagsApi } from "@/lib/api/tags.api";
import { Tag } from "@prisma/client";

export function useTagList() {
    return useQuery({
        queryKey: ["tags"],
        queryFn: async () => {
            const response = await tagsApi.getAll();
            return response.data;
        },
    });
}

export function useTagDetail(id: string) {
    return useQuery({
        queryKey: ["tags", id],
        queryFn: async () => {
            const response = await tagsApi.getById(id);
            return response.data;
        },
        enabled: !!id,
    });
}

export function useCreateTag() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await tagsApi.create(data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tags"] });
        },
    });
}

export function useUpdateTag() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await tagsApi.update(id, data);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["tags"] });
            queryClient.invalidateQueries({ queryKey: ["tags", data.id] });
        },
    });
}

export function useDeleteTag() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await tagsApi.delete(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tags"] });
        },
    });
}
