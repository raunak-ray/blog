import { checkAuth } from "@/lib/checkAuth";
import { connectToDb } from "@/lib/db";
import Blog from "@/model/Blog";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await connectToDb();

        const user = await checkAuth();

        if (!user) {
            return NextResponse.json({
                message: "Unauthorized",
                success: false,
                data: null,
            }, {status: 401})
        }

        let body;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({
                message: "Invalid JSON body",
                success: false,
                data: null,
            }, { status: 400 });
        }

        const {title, content, coverImage, category, tags} = body;

        if (!title || !content || !coverImage || !category) {
            return NextResponse.json({
                message: "All fields are required",
                success: false,
                data: null,
            }, {status: 400})
        }
        const blog = await Blog.create({
            title,
            content,
            coverImage,
            category,
            tags,
            author: user._id,
        })

        return NextResponse.json({
            message: "Blog created successfully",
            success: true,
            data: blog,
        }, {status: 201});
        
    } catch (error) {
        return NextResponse.json({
            message: "Error in create blog",
            success: false,
            error: error,
        }, {status: 500})
    }
}