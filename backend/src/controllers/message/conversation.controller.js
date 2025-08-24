import { Conversation } from "../../models/conversation.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { User } from "../../models/user.model.js";
import { GroupMember } from "../../models/groupMember.model.js";
import { io } from "../../../socket.js";
import { Notification } from "../../models/notifications.model.js";

const getConversation = asyncHandler(async (req, res) => {
    const { targetId } = req.params;
    const targetUser = await User.findById(targetId);
    if (!targetUser) {
        throw new ApiError(404, "Target user not found");
    }
    if (targetId === req.userId) {
        throw new ApiError(400, "You cannot start a conversation with yourself");
    }
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

const getConversationById = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.userId;
    if (!conversationId) {
        throw new ApiError(400, "Conversation ID is required");
    }

    const conversation = await Conversation.findById(conversationId)
        .populate("participants", "_id userName fullName profile_image")
    // .populate("members.user", "_id userName fullName profile_image")
    if (!conversation) {
        throw new ApiError(404, "Conversation not found");
    }
    if (conversation.isGroup) {
        const groupMember = await GroupMember.findOne({
            group: conversationId,
            member: userId,
            status: "joined",
        });
        if (!groupMember) {
            throw new ApiError(403, "either group not exsit or You are not a member of this group");
        }

        const allMembers = await GroupMember.find({
            group: conversationId
        }).populate("member", "_id userName fullName profile_image")

        return res.status(200).json(
            new ApiResponse(200, { conversation, members: allMembers }, "fetched conversation successfully")
        );
    }


    res.status(200).json(
        new ApiResponse(200, conversation, "fetched conversation successfully")
    );
});




const getAllConversations = asyncHandler(async (req, res) => {
    const userId = req.userId;

    // First, get all group IDs where user is a member with "joined" status
    const userGroups = await GroupMember.find({
        member: userId,
        status: "joined"
    }).distinct("group")

    const conversations = await Conversation.aggregate([
        {
            $match: {
                $or: [
                    {
                        $and: [
                            { participants: { $in: [userId] } },
                            { isGroup: false },
                            { lastMessage: { $exists: true } },
                        ],
                    },
                    {
                        $and: [
                            { _id: { $in: userGroups } },
                            { isGroup: true },
                        ],
                    }
                ],
            },
        },
        {
            $lookup: {
                from: "users",
                let: { participantIds: "$participants" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $in: ["$_id", "$$participantIds"] }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            userName:1,
                            fullName:1,
                            profile_image:1,

                        }
                    }
                ],
                as: "participants"
            }
        },
        {
            $lookup: {
                from: "messages",
                localField: "lastMessage",
                foreignField: "_id",
                as: "lastMessage",
            },
        },
        {
            $lookup: {
                from: "messages",
                let: { convId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$conversationId", "$$convId"] },
                                    { $not: { $in: [userId, "$seenBy"] } }
                                ]
                            }
                        }
                    }
                ],
                as: "unseenMessages"
            }
        },
        {
            $addFields: {
                unseenCount: { $size: "$unseenMessages" }
            }
        },
        {
            $project: {
                unseenMessages: 0
            }
        },
        {
            $unwind: {
                path: "$lastMessage",
                preserveNullAndEmptyArrays: true,
            }
        },
        {
            $sort: {
                // "lastMessage.createdAt": -1,// Sort by lastMessage.createdAt in descending order
                "updatedAt": -1, // fallback for those without lastMessage
            },
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

const createGroup = asyncHandler(async (req, res) => {
    //console.log(req.body, req.files);

    const { groupName, invitedTo } = req.body;
    const userId = req.userId;

    // log datatype of invited to

    let parsedInvitedTo;
    try {
        parsedInvitedTo = JSON.parse(invitedTo);
    } catch (error) {
        throw new ApiError(400, "Invited members should be a valid JSON array");
    }


    if (!groupName || !invitedTo) {
        throw new ApiError(400, "Group name and members are required");
    }

    // Handle avatar Image Uploads
    let avatarUpload = null;
    if (req.files?.avatar?.length > 0) {
        avatarUpload = await uploadOnCloudinary(req.files.avatar[0].path);
        if (!avatarUpload) {
            throw new ApiError(500, "Failed to upload avatar");
        }
        //console.log("Avatar Upload:", avatarUpload.secure_url);

    }

    const newConversation = await Conversation.create({
        participants: [userId],
        groupName,
        isGroup: true,
        avatar: avatarUpload ? avatarUpload.secure_url : "",
    });

    if (!newConversation) {
        throw new ApiError(500, "Failed to create group conversation");
    }

    // Add the creator as a member with status 'joined'
    await GroupMember.create({
        group: newConversation._id,
        member: userId,
        invited_by: userId,
        status: "joined",
        role: "owner",
    });
    // Add invited members to the group
    const invitedMembers = parsedInvitedTo.map((memberId) => ({
        group: newConversation._id,
        member: memberId,
        invited_by: userId,
        status: "invited",
        role: "member",
    }));
    if (invitedMembers.length > 0) {
    try {
        const insertedMembers = await GroupMember.insertMany(invitedMembers, { ordered: false });
        // console.log("Invited members added successfully");
        
        // Create notifications for each invited member
        const notifications = insertedMembers.map((member) => ({
            toUserId: member.member,
            type: "group_invite",
            message: `${userId} invited you to join the group "${groupName}"`,
            groupId: newConversation._id,
            Image: avatarUpload ? avatarUpload.secure_url : "", // Use group avatar or default image
        }));

        // Create notifications in bulk
        const createdNotifications = await Notification.insertMany(notifications, { ordered: false });
        // console.log("Group invite notifications created successfully");

        // Send socket notifications to each invited member
        createdNotifications.forEach((notification) => {
            // Emit socket event for real-time notification
            io.to(`notif_${notification.recipient}`).emit('new_notification', {
                type: 'group_invite',
                message: `You have been invited to join the group "${groupName}"`,
                data: {
                    groupId: newConversation._id,
                    groupName: groupName,
                    notificationId: notification._id,
                    invitedBy: userId
                }
            });
        });

    } catch (error) {
        console.error("Error in group member or notification creation:", error);
        // You can decide whether to throw this error or just log it
    }
}

    res.status(201).json(
        new ApiResponse(201, newConversation, "created group successfully")
    );
}
);

const getGroupInvites = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const groupInvites = await GroupMember.find({
        member: userId,
        status: "invited",
    }).populate("group").populate("invited_by", "_id userName profile_image")


    if (!groupInvites) {
        throw new ApiError(404, "No group invites found");
    }

    res.status(200).json(
        new ApiResponse(200, groupInvites, "fetched group invites successfully")
    );
}
);

const AcceptGroupInvite = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.userId;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
        throw new ApiError(404, "Conversation not found");
    }

    const member = await GroupMember.findOne({
        group: conversationId,
        member: userId,
        status: "invited"
    })

    if (!member) {
        throw new ApiError(400, "You are not invited to this group");
    }

    member.status = "joined";
    await member.save();

    res.status(200).json(
        new ApiResponse(200, conversation, "Accepted group invite successfully")
    );
}
);




export { getConversation, getAllConversations, createGroup, getConversationById, getGroupInvites, AcceptGroupInvite };