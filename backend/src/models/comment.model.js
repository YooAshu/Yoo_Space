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
        },
        content:{
            type:String,
            required:true
        }
    },
    {
        timestamps: true
    }
)


const CommentLikeSchema = new mongoose.Schema({

    liked_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    liked_on: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: true
    },
})

export const CommentLike = mongoose.model("CommentLike",CommentLikeSchema)

export const Comment = mongoose.model("Comment",commentSchema)