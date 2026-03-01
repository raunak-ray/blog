import { connectToDb } from "@/lib/db";
import Blog from "@/model/Blog";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    {params}: {params: {id: string}}
) {
    try {
        await connectToDb();

        const {id} = await params;

        const blogs = await Blog.find({author: id})
                            .populate("author", "name")
                            .sort({createdAt: -1});

        return NextResponse.json({
                    message: "Blogs fetched successfully",
                    success: true,
                    data: blogs
        });
    } catch (error) {
        return NextResponse.json({
                    message: "Error in get blog by author",
                    success: false,
                    error: error,
                }, 
                {status: 500}
        )
    }
}