import http, { ApiResponse } from './http';
import { Tag } from '@prisma/client';

export const tagsApi = {
    getAll: async (): Promise<ApiResponse<Tag[]>> => {
        return http.get('/tags');
    },

    getById: async (id: string): Promise<ApiResponse<Tag>> => {
        return http.get(`/tags/${id}`);
    },

    create: async (data: any): Promise<ApiResponse<Tag>> => {
        return http.post('/tags', data);
    },

    update: async (id: string, data: any): Promise<ApiResponse<Tag>> => {
        return http.put(`/tags/${id}`, data);
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
        return http.delete(`/tags/${id}`);
    },
};
