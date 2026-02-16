import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/categories/[id]
export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const category = await prisma.category.findUnique({
            where: { id: params.id },
            include: {
                _count: { select: { posts: true } },
            },
        });

        if (!category) {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: { ...category, postCount: category._count.posts }
        });
    } catch (error) {
        console.error("Error fetching category:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch category" },
            { status: 500 }
        );
    }
}

// PUT /api/categories/[id]
export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const body = await request.json();
        const { name, description } = body;

        if (!name) {
            return NextResponse.json(
                { success: false, message: "Name is required" },
                { status: 400 }
            );
        }

        // Slug update logic (optional, simplifying to not notify changes unless necessary)
        // Assuming simple implementation where name update updates slug too if we want, or keeping slug stable.
        // Let's update slug if name changes.
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const category = await prisma.category.update({
            where: { id: params.id },
            data: {
                name,
                slug,
                // Description check? Not in schema.
            },
        });

        return NextResponse.json({ success: true, data: category });
    } catch (error) {
        console.error("Error updating category:", error);
        if ((error as any).code === 'P2002') {
            return NextResponse.json(
                { success: false, message: "Category name already exists" },
                { status: 400 }
            );
        }
        if ((error as any).code === 'P2025') {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: false, message: "Failed to update category" },
            { status: 500 }
        );
    }
}

// DELETE /api/categories/[id]
export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        await prisma.category.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true, message: "Category deleted" });
    } catch (error) {
        console.error("Error deleting category:", error);
        if ((error as any).code === 'P2025') {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 }
            );
        }
        // Handle foreign key constraint if posts exist?
        // Prisma on SQLite sets null or restricts depending on schema.
        return NextResponse.json(
            { success: false, message: "Failed to delete category" },
            { status: 500 }
        );
    }
}
