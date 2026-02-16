/**
 * Deterministic mock data for UI development and testing.
 * These match the structure of the Prisma models and API responses.
 */

export const MOCK_USERS = [
    {
        id: "user_admin_01",
        name: "Admin User",
        email: "admin@blog.com",
        role: "ADMIN",
        createdAt: "2026-02-01T00:00:00.000Z",
    },
    {
        id: "user_editor_01",
        name: "Editor Jane",
        email: "jane@blog.com",
        role: "EDITOR",
        createdAt: "2026-02-02T00:00:00.000Z",
    },
];

export const MOCK_CATEGORIES = [
    { id: "cat_tech_01", name: "Technology", slug: "technology", _count: { posts: 10 } },
    { id: "cat_design_01", name: "Design", slug: "design", _count: { posts: 5 } },
];

export const MOCK_TAGS = [
    { id: "tag_react_01", name: "React", slug: "react", _count: { posts: 8 } },
    { id: "tag_next_01", name: "Next.js", slug: "nextjs", _count: { posts: 4 } },
    { id: "tag_tailwind_01", name: "Tailwind", slug: "tailwind", _count: { posts: 6 } },
];

export const MOCK_POSTS = Array.from({ length: 15 }, (_, i) => ({
    id: `post_${(i + 1).toString().padStart(2, "0")}`,
    title: `Post Title ${i + 1}: Mastering ${i % 2 === 0 ? "Frontend" : "Backend"}`,
    slug: `post-mastering-${i % 2 === 0 ? "frontend" : "backend"}-${i + 1}`,
    content: `This is the content for post ${i + 1}.`,
    published: i % 2 === 0,
    categoryId: i % 3 === 0 ? "cat_tech_01" : "cat_design_01",
    authorId: i % 2 === 0 ? "user_admin_01" : "user_editor_01",
    createdAt: `2026-02-${(i + 1).toString().padStart(2, "0")}T10:00:00.000Z`,
    category: i % 3 === 0 ? { name: "Technology" } : { name: "Design" },
    _count: { comments: 1 },
}));
