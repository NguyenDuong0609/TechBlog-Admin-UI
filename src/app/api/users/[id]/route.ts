import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/users/[id]
export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: params.id },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: user });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch user" },
            { status: 500 }
        );
    }
}

// PUT /api/users/[id]
export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const body = await request.json();
        const { name, email, role } = body;

        if (!name || !email) {
            return NextResponse.json(
                { success: false, message: "Name and email are required" },
                { status: 400 }
            );
        }

        const user = await prisma.user.update({
            where: { id: params.id },
            data: {
                name,
                email,
                role,
            },
        });

        return NextResponse.json({ success: true, data: user });
    } catch (error) {
        console.error("Error updating user:", error);
        if ((error as any).code === 'P2002') {
            return NextResponse.json(
                { success: false, message: "Email already exists" },
                { status: 400 }
            );
        }
        if ((error as any).code === 'P2025') {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: false, message: "Failed to update user" },
            { status: 500 }
        );
    }
}

// DELETE /api/users/[id]
export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        await prisma.user.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true, message: "User deleted" });
    } catch (error) {
        console.error("Error deleting user:", error);
        if ((error as any).code === 'P2025') {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: false, message: "Failed to delete user" },
            { status: 500 }
        );
    }
}
