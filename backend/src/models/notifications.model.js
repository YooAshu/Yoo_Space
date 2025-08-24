import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        type:{
            type: String,
            enum: ['group_invite', 'reaction', 'follow', 'comment'],
            required: true
        },
        message: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation',
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
        image: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true, // adds createdAt and updatedAt
    }
);

export const Notification = mongoose.model('Notification', notificationSchema);
