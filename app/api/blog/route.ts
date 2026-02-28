import { connectToDb } from "@/lib/db";
import Blog from "@/model/Blog";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDb();

        const blogs = await Blog.find()
                        .populate("author", "name")
                        .sort({createdAt: -1})

        return NextResponse.json({
                    message: "Blogs fetched successfully",
                    success: true,
                    data: blogs
        });
    } catch (error) {
        return NextResponse.json({
                    message: "Error in get all blogs",
                    success: false,
                    error: error,
                }, 
                {status: 500}
        )
    }
} 