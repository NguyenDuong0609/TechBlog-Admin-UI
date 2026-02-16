import axios, { AxiosError, AxiosResponse } from 'axios';

// Create axios instance
const http = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for consistent error handling and data extraction
http.interceptors.response.use(
    (response: AxiosResponse) => {
        // Return the data property directly if standard response format is { success: true, data: ... }
        // Or return full response?
        // User requirement: "Typed request & response".
        // Let's return response.data to simplify usage: await api.getPosts() -> { success: true, data: ... }
        return response.data;
    },
    (error: AxiosError) => {
        const message = (error.response?.data as any)?.message || error.message || 'Something went wrong';
        // We can reject with enriched error or just message
        return Promise.reject(new Error(message));
    }
);

export default http;

// Generic response type matching our API standard
export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
}
