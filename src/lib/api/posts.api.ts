import http, { ApiResponse } from './http';
import { Post } from '@prisma/client';

// We might fetch Post with Payload (e.g. including category). 
// For now use Post type from Prisma, or define specific DTOs.
// Frontend Mock data used explicit interfaces.
// Let's use Prisma types if available, or fetch types.

export const postsApi = {
    getAll: async (): Promise<ApiResponse<Post[]>> => {
        return http.get('/posts');
    },

    getById: async (id: string): Promise<ApiResponse<Post>> => {
        return http.get(`/posts/${id}`);
    },

    create: async (data: any): Promise<ApiResponse<Post>> => {
        return http.post('/posts', data);
    },

    update: async (id: string, data: any): Promise<ApiResponse<Post>> => {
        return http.put(`/posts/${id}`, data);
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
        return http.delete(`/posts/${id}`);
    },
};
