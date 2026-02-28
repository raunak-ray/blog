import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },    password: {
        type: String,
        required: true,
        minlength: 8,
    }
}, {timestamps: true})

const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User;