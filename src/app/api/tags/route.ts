import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/tags
export async function GET() {
    try {
        const tags = await prisma.tag.findMany({
            orderBy: { name: "asc" },
            // Schema doesn't have posts relation in Tag.
            // Assuming simple tag list.
        });
        return NextResponse.json({ success: true, data: tags });
    } catch (error) {
        console.error("Error fetching tags:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch tags" },
            { status: 500 }
        );
    }
}

// POST /api/tags
export async function POST(request: Request) {
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

        const existing = await prisma.tag.findUnique({ where: { slug } });
        if (existing) {
            return NextResponse.json(
                { success: false, message: "Tag already exists" },
                { status: 400 }
            );
        }

        const tag = await prisma.tag.create({
            data: {
                name,
                slug,
                // Color is not in schema provided in user prompt?
                // User prompt: model Tag { id, name, slug }
                // I should ignore color in Prisma creation, but maybe store it if schema had it.
                // I will ignore for now to respect schema.
            },
        });

        return NextResponse.json({ success: true, data: tag }, { status: 201 });
    } catch (error) {
        console.error("Error creating tag:", error);
        if ((error as any).code === 'P2002') {
            return NextResponse.json(
                { success: false, message: "Tag name already exists" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: "Failed to create tag" },
            { status: 500 }
        );
    }
}
