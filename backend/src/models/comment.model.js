import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        commented_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        commented_on: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true
        },
        no_of_like: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
)

export const Comment = mongoose.model("Comment",commentSchema)