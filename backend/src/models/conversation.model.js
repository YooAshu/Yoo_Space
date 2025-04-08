import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        },
        theme: {
            type: String,
        },
        isGroup: {
            type: Boolean,
            default: false
        },
        groupName: {
            type: String,
            default: ''
        },
        avatar: {
            type: String,
            default: ''
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

export const Conversation = mongoose.model('Conversation', conversationSchema);