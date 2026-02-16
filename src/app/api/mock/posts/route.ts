import { NextResponse } from "next/server";
import { MOCK_POSTS } from "@/lib/mock-data";

export async function GET() {
    return NextResponse.json({
        success: true,
        data: MOCK_POSTS,
    });
}

export async function POST(request: Request) {
    const body = await request.json();
    const newPost = {
        ...body,
        id: `post_${Date.now()}`,
        createdAt: new Date().toISOString(),
        _count: { comments: 0 },
    };

    return NextResponse.json({
        success: true,
        data: newPost,
    });
}
