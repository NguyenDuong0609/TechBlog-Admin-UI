import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/categories
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: { posts: true },
                },
            },
        });

        // Transform to include postCount
        const data = categories.map(cat => ({
            ...cat,
            postCount: cat._count.posts,
        }));

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}

// POST /api/categories
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description } = body;

        if (!name) {
            return NextResponse.json(
                { success: false, message: "Name is required" },
                { status: 400 }
            );
        }

        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const existing = await prisma.category.findUnique({ where: { slug } });
        if (existing) {
            return NextResponse.json(
                { success: false, message: "Category already exists" },
                { status: 400 }
            );
        }

        const category = await prisma.category.create({
            data: {
                name,
                slug,
                // Description is not in schema provided in user prompt?
                // User prompt: model Category { id, name, slug, posts }
                // Wait, check schema.prisma again.
            },
        });

        return NextResponse.json({ success: true, data: category }, { status: 201 });
    } catch (error) {
        console.error("Error creating category:", error);
        if ((error as any).code === 'P2002') {
            return NextResponse.json(
                { success: false, message: "Category name already exists" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: "Failed to create category" },
            { status: 500 }
        );
    }
}
