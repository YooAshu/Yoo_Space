import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receiver: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        text: {
            type: String,
            required: true,
        },
        media: {
            type: String, // URL to image/file if any
        },
        seenBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true, // adds createdAt and updatedAt
    }
);

export const Message = mongoose.model('Message', messageSchema);
