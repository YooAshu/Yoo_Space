import mongoose from 'mongoose';

const groupMemberSchema = new mongoose.Schema(
    {

        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
        },
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        invited_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['invited', 'joined', 'left'],
            default: 'invited',
        },
        role: {
            type: String,
            enum: ['admin', 'member', 'owner'],
            default: 'member',
        },
        

    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

export const GroupMember = mongoose.model('GroupMember', groupMemberSchema);