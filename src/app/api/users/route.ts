import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/users
export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json({ success: true, data: users });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch users" },
            { status: 500 }
        );
    }
}

// POST /api/users
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, role } = body;

        if (!name || !email) {
            return NextResponse.json(
                { success: false, message: "Name and email are required" },
                { status: 400 }
            );
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json(
                { success: false, message: "Email already exists" },
                { status: 400 }
            );
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                role: role || "viewer",
            },
        });

        return NextResponse.json({ success: true, data: user }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        if ((error as any).code === 'P2002') {
            return NextResponse.json(
                { success: false, message: "Email already exists" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: "Failed to create user" },
            { status: 500 }
        );
    }
}
