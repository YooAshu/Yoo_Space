import { asyncHandler } from "../../utils/asyncHandler.js";
import { Message } from "../../models/message.model.js"
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { io } from "../../../socket.js";
import { Conversation } from "../../models/conversation.model.js";
const sendMessage = asyncHandler(async (req, res) => {
    const { text, receiver } = req.body;
    const userId = req.userId;
    const { conversationId } = req.params;
    if (!text || !receiver) {
        throw new ApiError(400, "text and receiver are required")
    }
    const newMessage = await Message.create({
        conversationId: conversationId,
        sender: userId,
        receiver: receiver,
        text: text,
    });

    if (!newMessage) {
        throw new ApiError(500, "failed to send message")
    }

    await Conversation.findByIdAndUpdate(
        conversationId,
        {
            $set: {
                lastMessage: newMessage._id
            }
        }
    )


    // Populate sender and receiver fields
    const populatedMessage = await newMessage.populate([
        { path: "sender", select: "_id userName profile_image" },
        { path: "receiver", select: "_id userName profile_image" }
    ]);

    // Emit populated message
    io.to(conversationId).emit("receive_message", populatedMessage);

    res.status(201).json(
        new ApiResponse(201, populatedMessage, "Message sent successfully")
    );
})

const getAllMessages = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId: conversationId })
        .populate("sender", "_id userName profile_image")
        .populate("receiver", "_id userName profile_image")
        .sort({ createdAt: -1 });

    if (!messages) {
        throw new ApiError(404, "no messages found")
    }

    res.status(200).json(
        new ApiResponse(200, messages, "messages fetched successfully")
    )
})

export { sendMessage, getAllMessages }