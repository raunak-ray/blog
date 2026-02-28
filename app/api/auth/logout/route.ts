import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const cookieStore = await cookies();

        cookieStore.set("token", "", {
            httpOnly: true,
            expires: new Date(0),
            path: "/",
        });

        return NextResponse.json({
            message: "User logged out successfully",
            success: true,
            data: null,
        }, { status: 200 });

    } catch {
        return NextResponse.json({
            message: "Logout failed",
            success: false,
            data: null,
        }, { status: 500 });
    }
}