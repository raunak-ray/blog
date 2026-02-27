import { connectToDb } from "@/lib/db";
import { signToken } from "@/lib/jwt";
import User from "@/model/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    await connectToDb();

    let email, password;

    try{
        ({email, password} = await request.json())
    }
    catch {
        return NextResponse.json({
            message: "Invalid JSON body",
            success: false,
            data: null
        }, { status: 400 });
    }

    if (!email || !password) {
        return NextResponse.json({
            message: "All fields are required",
            success: false,
            data: null
        }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({email: normalizedEmail})

    if (!user) {
        return NextResponse.json({
            message: "User not found",
            success: false,
            data: null
        }, { status: 400 });
    }

    const isVerified = await bcrypt.compare(password, user.password)

    if (!isVerified) {
        return NextResponse.json({
            message: "Invalid Credentials",
            success: false,
            data: null
        }, { status: 401 });
    }

    const token = signToken({id: user._id});

    const res = NextResponse.json({
        message: "User logged in successfully",
        success: true,
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
        }
    }, { status: 200 });

    res.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/"
    } )


    return res;
}