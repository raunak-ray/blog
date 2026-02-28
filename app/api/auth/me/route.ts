import { connectToDb } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import User from "@/model/User";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDb();

        const token = (await cookies()).get("token")?.value;

        if (!token) {
            return NextResponse.json({
                message: "Unauthorized",
                success: false,
                data: null,
            }, { status: 401 });
        }

        let decoded;

        try {
            decoded = verifyToken(token);
        } catch {
            return NextResponse.json({
                message: "Invalid token",
                success: false,
                data: null,
            }, { status: 401 });
        }

        if (typeof decoded === "string" || !("id" in decoded)) {
            return NextResponse.json({
                message: "Invalid token",
                success: false,
                data: null,
            }, { status: 401 });
        }

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return NextResponse.json({
                message: "User not found",
                success: false,
                data: null,
            }, { status: 404 });
        }

        return NextResponse.json({
            message: "User fetched successfully",
            success: true,
            data: user,
        });

    } catch {
        return NextResponse.json({
            message: "Internal server error",
            success: false,
            data: null,
        }, { status: 500 });
    }
}