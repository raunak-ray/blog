import mongoose, { Schema } from "mongoose"

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ["technology", "ai", "dsa", "development"],
        required: true,
        lowercase: true,
    },
    tags: {
        type: [String],
        default: [],
        lowercase: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {timestamps: true});

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default Blog;