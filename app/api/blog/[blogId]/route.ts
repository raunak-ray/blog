import { checkAuth } from "@/lib/checkAuth";
import { connectToDb } from "@/lib/db";
import Blog from "@/model/Blog";
import { NextResponse } from "next/server";

export async function DELETE(
    request: Request, 
    {params} : {params: {blogId: string}}
) {
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

        const {blogId} = await params;

        const blog = await Blog.findById(blogId);

        if (!blog) {
            return NextResponse.json({
                            message: "Blog not found",
                            success: false,
                            data: null,
            }, {status: 404})
        }

        if (blog.author.toString() !== user._id.toString()) {
            return NextResponse.json({
                            message: "Forbidden: You can only delete your blogs",
                            success: false,
                            data: null,
            }, {status: 403})
        }

        await Blog.findByIdAndDelete(blogId);

        return NextResponse.json({
            message: "Blog deleted successfully",
            success: true,
            data: null,
        }, {status: 200})
    } catch (error) {
        return NextResponse.json({
                    message: "Error in deleting blog",
                    success: false,
                    error,
        }, { status: 500 });
    }
}