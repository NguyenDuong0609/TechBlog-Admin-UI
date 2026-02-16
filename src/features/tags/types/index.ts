/**
 * Tag types for the blog system
 */

export interface Tag {
    id: string;
    name: string;
    slug: string;
    postCount: number;
    color?: string;
    createdAt: string;
}
