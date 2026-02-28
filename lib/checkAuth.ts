import { cookies } from "next/headers";
import { connectToDb } from "./db";
import { verifyToken } from "./jwt";
import User from "@/model/User";

export async function checkAuth() {
    await connectToDb();

    const token = (await cookies()).get("token")?.value;

    if (!token) return null;

    try {
        const decoded = verifyToken(token);

        if (typeof decoded === "string" || !("id" in decoded)) {
            return null;
        }

        if (typeof decoded.id !== "string") {
            return null;
        }

        const user = await User.findById(decoded.id).select("-password");
        return user;
    } catch {
        return null;
    }
}