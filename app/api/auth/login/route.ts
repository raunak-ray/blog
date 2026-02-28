import { connectToDb } from "@/lib/db";
import { signToken } from "@/lib/jwt";
import User from "@/model/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await connectToDb();

        const { email, password } = await request.json();

        if (!email || !password || typeof email !== "string" || typeof password !== "string") {
            return NextResponse.json({
                message: "All fields are required",
                success: false,
                data: null
            }, { status: 400 });
        }
        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return NextResponse.json({
                message: "Invalid credentials",
                success: false,
                data: null
            }, { status: 401 });
        }

        const isVerified = await bcrypt.compare(password, user.password);

        if (!isVerified) {
            return NextResponse.json({
                message: "Invalid credentials",
                success: false,
                data: null
            }, { status: 401 });
        }

        const token = signToken({ id: user._id });

        const userObject = user.toObject();
        delete userObject.password;

        const res = NextResponse.json({
            message: "User logged in successfully",
            success: true,
            data: userObject,
        });

        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/"
        });

        return res;

    } catch {
        return NextResponse.json({
            message: "Login failed",
            success: false,
            data: null
        }, { status: 500 });
    }
}