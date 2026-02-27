import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;


let isConnected: boolean = false;

export async function connectToDb() {
    if (isConnected) return;

    const db = await mongoose.connect(MONGO_URI);

    isConnected = db.connections[0].readyState === 1;

    console.log("Db connected successfully");
    
}