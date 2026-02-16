import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi, CategoryWithCount } from "@/lib/api/categories.api";
import { Category } from "@prisma/client";

export function useCategoryList() {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await categoriesApi.getAll();
            return response.data;
        },
    });
}

export function useCategoryDetail(id: string) {
    return useQuery({
        queryKey: ["categories", id],
        queryFn: async () => {
            const response = await categoriesApi.getById(id);
            return response.data;
        },
        enabled: !!id,
    });
}

export function useCreateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await categoriesApi.create(data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await categoriesApi.update(id, data);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories", data.id] });
        },
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await categoriesApi.delete(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
}
