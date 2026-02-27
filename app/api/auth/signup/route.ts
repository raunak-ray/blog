import { connectToDb } from "@/lib/db";
import { signToken } from "@/lib/jwt";
import User from "@/model/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await connectToDb();

    let name, email, password;
    try {
        ({ name, email, password } = await request.json());
    } catch {
        return NextResponse.json({
            message: "Invalid JSON body",
            success: false,
            data: null
        }, { status: 400 });
    }
    

    if (password.length < 8) {
        return NextResponse.json({
            message: "Password must be at least 8 characters long",
            success: false,
            data: null
        }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({email: normalizedEmail})

    if (existingUser) {
        return NextResponse.json({
            message: "User already exists",
            success: false,
            data: null
        }, {status: 400})
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword
    });

    const token = signToken({id: newUser._id})

    const res = NextResponse.json({
        message: "User created successfully",
        success: true,
        data: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email
        }
    }, {status: 201})

    res.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/"
    } )

    return res;
}