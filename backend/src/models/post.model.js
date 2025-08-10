import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
    {
        content: {
            type: String,
        },
        media: {
            type: [String]
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        no_of_like: {
            type: Number,
            default: 0
        },
        no_of_comment: {
            type: Number,
            default: 0
        },
        aspectRatio: {
            type: Number,
            required: true,
            default: 1.0
        }

    },
    {
        timestamps: true
    }
)

export const Post = mongoose.model("Post", postSchema)