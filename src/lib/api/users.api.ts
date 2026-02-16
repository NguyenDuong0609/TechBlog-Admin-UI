import http, { ApiResponse } from './http';
import { User } from '@prisma/client';

export const usersApi = {
    getAll: async (): Promise<ApiResponse<User[]>> => {
        return http.get('/users');
    },

    getById: async (id: string): Promise<ApiResponse<User>> => {
        return http.get(`/users/${id}`);
    },

    create: async (data: any): Promise<ApiResponse<User>> => {
        return http.post('/users', data);
    },

    update: async (id: string, data: any): Promise<ApiResponse<User>> => {
        return http.put(`/users/${id}`, data);
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
        return http.delete(`/users/${id}`);
    },
};
