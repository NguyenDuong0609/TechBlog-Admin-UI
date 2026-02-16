import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/posts
export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                category: true,
                tags: true,
            },
        });
        return NextResponse.json({ success: true, data: posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch posts",
                hint: "Check if database is initialized and migrations are applied.",
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}

// POST /api/posts
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, content, status, categoryId, tags, excerpt, metaTitle, metaDescription } = body;

        // Basic validation
        if (!title || !content) {
            return NextResponse.json(
                { success: false, message: "Title and content are required" },
                { status: 400 }
            );
        }

        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        // Check slug uniqueness
        const existing = await prisma.post.findUnique({ where: { slug } });
        if (existing) {
            return NextResponse.json(
                { success: false, message: "Slug already exists" },
                { status: 400 }
            );
        }

        const post = await prisma.post.create({
            data: {
                title,
                slug,
                content,
                status: status || "draft",
                published: status === "published",
                publishedAt: status === "published" ? new Date() : null,
                categoryId,
                excerpt,
                metaTitle,
                metaDescription,
                tags: tags && tags.length > 0 ? {
                    connect: tags.map((id: string) => ({ id }))
                } : undefined,
            },
            include: {
                category: true,
                tags: true
            }
        });

        return NextResponse.json({ success: true, data: post }, { status: 201 });
    } catch (error) {
        console.error("Error creating post:", error);
        // If slug constraint failed (race condition)
        if ((error as any).code === 'P2002') {
            return NextResponse.json(
                { success: false, message: "Slug already exists" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            {
                success: false,
                message: "Failed to create post",
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
