/**
 * Post types for the blog system
 */

export type PostStatus = "draft" | "published" | "archived";

export interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    status: PostStatus;
    categoryId: string;
    categoryName: string;
    tags: string[];
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    viewCount: number;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PostFormData {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    status: PostStatus;
    categoryId: string;
    tags: string[];
}
