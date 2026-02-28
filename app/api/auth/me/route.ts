import { connectToDb } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import User from "@/model/User";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    await connectToDb();

    const token = (await cookies()).get("token")?.value;

    if (!token) {
        return NextResponse.json({
                    message: "Token not provided",
                    success: false,
                    data: null,
                }, { status: 400 });
    }

    const decoded = verifyToken(token);

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
    }, { status: 200 });
}