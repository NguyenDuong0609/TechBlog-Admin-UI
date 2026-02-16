/**
 * User types for the blog system
 */

export type UserRole = "admin" | "editor" | "author" | "viewer";
export type UserStatus = "active" | "inactive" | "suspended";

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: UserRole;
    status: UserStatus;
    bio?: string;
    postCount: number;
    lastLoginAt?: string;
    createdAt: string;
    updatedAt: string;
}
