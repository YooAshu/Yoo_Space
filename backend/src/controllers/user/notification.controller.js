import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const getAllNotifications = asyncHandler(async(req,res,next)=>{
    const notifications = await Notification.find({ toUserId: req.userId })
        .sort({ createdAt: -1 }); // Newest notifications first

    if (!notifications) {
        throw new ApiError(404, "No notifications found");
    }

    return res.status(200).json(
        new ApiResponse(200, notifications, "Notifications fetched successfully")
    );
});