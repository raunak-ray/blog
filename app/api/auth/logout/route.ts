import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    (await cookies()).delete("token");

    return NextResponse.json({
            message: "User logged out successfully",
            success: true,
            data: null,
        }, { status: 200 });
}