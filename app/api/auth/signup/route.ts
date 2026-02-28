import { connectToDb } from "@/lib/db";
import { signToken } from "@/lib/jwt";
import User from "@/model/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await connectToDb();

        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({
                message: "Missing required fields",
                success: false,
                data: null
            }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({
                message: "Password must be at least 8 characters",
                success: false,
                data: null
            }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return NextResponse.json({
                message: "User already exists",
                success: false,
                data: null
            }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword
        });

        const token = signToken({ id: newUser._id });

        const userObject = newUser.toObject();
        delete userObject.password;

        const res = NextResponse.json({
            message: "User created successfully",
            success: true,
            data: userObject
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
            message: "Signup failed",
            success: false,
            data: null
        }, { status: 500 });
    }
}