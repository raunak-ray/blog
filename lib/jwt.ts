import jwt, { JwtPayload } from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET!;

export function signToken(payload: object): string {
    return jwt.sign(payload, JWT_SECRET, {expiresIn: "1d"}) as string;
}

export function verifyToken(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
}