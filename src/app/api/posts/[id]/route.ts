import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/posts/[id]
export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const post = await prisma.post.findUnique({
            where: { id: params.id },
            include: { category: true },
        });

        if (!post) {
            return NextResponse.json(
                { success: false, message: "Post not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: post });
    } catch (error) {
        console.error("Error fetching post:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch post" },
            { status: 500 }
        );
    }
}

// PUT /api/posts/[id]
export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const body = await request.json();
        const { title, content, status, categoryId } = body;

        const post = await prisma.post.update({
            where: { id: params.id },
            data: {
                title,
                content,
                published: status === "published",
                categoryId,
                // If slug update is needed, handle it. Usually slug is not updated or handled carefully.
            },
        });

        return NextResponse.json({ success: true, data: post });
    } catch (error) {
        console.error("Error updating post:", error);
        if ((error as any).code === 'P2025') {
            return NextResponse.json(
                { success: false, message: "Post not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: false, message: "Failed to update post" },
            { status: 500 }
        );
    }
}

// DELETE /api/posts/[id]
export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        await prisma.post.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true, message: "Post deleted" });
    } catch (error) {
        console.error("Error deleting post:", error);
        if ((error as any).code === 'P2025') {
            return NextResponse.json(
                { success: false, message: "Post not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: false, message: "Failed to delete post" },
            { status: 500 }
        );
    }
}
