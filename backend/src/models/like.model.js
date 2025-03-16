import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({

    liked_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    liked_on: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
})

export const Like = mongoose.model("Like",likeSchema)