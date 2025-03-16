import mongoose from "mongoose";

const followSchema = new mongoose.Schema({

    followed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    followed_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
})

export const Follow = mongoose.model("Follow",followSchema)