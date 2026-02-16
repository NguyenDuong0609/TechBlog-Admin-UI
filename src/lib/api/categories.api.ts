import http, { ApiResponse } from './http';
import { Category } from '@prisma/client';

export interface CategoryWithCount extends Category {
    postCount: number;
}

export const categoriesApi = {
    getAll: async (): Promise<ApiResponse<CategoryWithCount[]>> => {
        return http.get('/categories');
    },

    getById: async (id: string): Promise<ApiResponse<CategoryWithCount>> => {
        return http.get(`/categories/${id}`);
    },

    create: async (data: any): Promise<ApiResponse<Category>> => {
        return http.post('/categories', data);
    },

    update: async (id: string, data: any): Promise<ApiResponse<Category>> => {
        return http.put(`/categories/${id}`, data);
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
        return http.delete(`/categories/${id}`);
    },
};
