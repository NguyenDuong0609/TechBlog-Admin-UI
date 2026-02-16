import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/tags/[id]
export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const tag = await prisma.tag.findUnique({
            where: { id: params.id },
        });

        if (!tag) {
            return NextResponse.json(
                { success: false, message: "Tag not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: tag });
    } catch (error) {
        console.error("Error fetching tag:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch tag" },
            { status: 500 }
        );
    }
}

// PUT /api/tags/[id]
export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const body = await request.json();
        const { name, color } = body;

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

        const tag = await prisma.tag.update({
            where: { id: params.id },
            data: {
                name,
                slug,
            },
        });

        return NextResponse.json({ success: true, data: tag });
    } catch (error) {
        console.error("Error updating tag:", error);
        if ((error as any).code === 'P2002') {
            return NextResponse.json(
                { success: false, message: "Tag name already exists" },
                { status: 400 }
            );
        }
        if ((error as any).code === 'P2025') {
            return NextResponse.json(
                { success: false, message: "Tag not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: false, message: "Failed to update tag" },
            { status: 500 }
        );
    }
}

// DELETE /api/tags/[id]
export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        await prisma.tag.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true, message: "Tag deleted" });
    } catch (error) {
        console.error("Error deleting tag:", error);
        if ((error as any).code === 'P2025') {
            return NextResponse.json(
                { success: false, message: "Tag not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: false, message: "Failed to delete tag" },
            { status: 500 }
        );
    }
}
