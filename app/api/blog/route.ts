import { connectToDb } from "@/lib/db";
import Blog from "@/model/Blog";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        await connectToDb();

        const { searchParams } = new URL(request.url);

        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 5;
        const allowedSortFields = ["createdAt", "updatedAt", "title"];
        const sortField = searchParams.get("sort") || "createdAt";
        const safeSortField = allowedSortFields.includes(sortField) ? sortField : "createdAt";        
        const order = searchParams.get("order") === "asc" ? 1 : -1;
        const category = searchParams.get("category");

        const skip = (page - 1) * limit;

        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filter: any = {};
        if (category) {
            filter.category = category.toLowerCase();
        }

        const blogs = await Blog.find(filter)
            .populate("author", "name")
            .sort({ [safeSortField]: order })
            .skip(skip)
            .limit(limit);

        const total = await Blog.countDocuments(filter);

        return NextResponse.json({
            message: "Blogs fetched successfully",
            success: true,
            data: blogs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        return NextResponse.json({
            message: "Error in get all blogs",
            success: false,
            error,
        }, { status: 500 });
    }
}