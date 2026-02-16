/**
 * Category types for the blog system
 */

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    postCount: number;
    createdAt: string;
    updatedAt: string;
}
