import { Conversation } from "../../models/conversation.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

const getConversation = asyncHandler(async (req, res) => {
    const { targetId } = req.params;
    const userId = req.userId;
    const conversation = await Conversation.findOne(
        {
            participants: { $all: [userId, targetId] },
        }
    ).populate("participants", "_id userName fullName profile_image");

    if (!conversation) {
        const newConversation = await Conversation.create({
            participants: [userId, targetId],
        });
        return res.status(201).json(
            new ApiResponse(201, newConversation, "created conversation successfully")
        );
    }
    res.status(200).json(
        new ApiResponse(200, conversation, "fetched conversation successfully")
    );

});


const getAllConversations = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const conversations = await Conversation.aggregate([
        {
            $match: {
                participants: { $in: [userId] },
                lastMessage: { $exists: true },
            },
        },
        {
            $lookup: {
                from: "users", // Replace with the actual collection name for participants
                localField: "participants",
                foreignField: "_id",
                as: "participants",
            },
        },
        {
            $lookup: {
                from: "messages", // Replace with the actual collection name for messages
                localField: "lastMessage",
                foreignField: "_id",
                as: "lastMessage",
            },
        },
        {
            $unwind: "$lastMessage",
        },
        {
            $sort: { "lastMessage.createdAt": -1 }, // Sort by lastMessage.createdAt in descending order
        },
    ]);

    if (!conversations || conversations.length === 0) {
        throw new ApiError(404, "No conversations found");
    }

    res.status(200).json(
        new ApiResponse(200, conversations, "fetched conversations successfully")
    );
}
);

export { getConversation, getAllConversations };