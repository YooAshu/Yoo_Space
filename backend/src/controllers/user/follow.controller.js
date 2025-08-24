import { asyncHandler } from "../../utils/asyncHandler.js";
import { Follow } from "../../models/follow.model.js"
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { io } from "../../../socket.js";

const followUser = asyncHandler(async (req, res, next) => {
    const { targetId } = req.params
    const userId = req.userId

    if (targetId == userId) {
        return next(new ApiError(400, "You cannot follow yourself"));
    }
    
    const existingFollow = await Follow.findOne({
        followed_by: userId,
        followed_to: targetId
    });
    
    if (existingFollow) {
        return next(new ApiError(400, "You are already following this user"));
    }

    const follow = await Follow.create({
        followed_by: userId,
        followed_to: targetId
    })

    await User.findByIdAndUpdate(
        userId,
        { $inc: { no_of_following: 1 } }
    )
    await User.findByIdAndUpdate(
        targetId,
        { $inc: { no_of_follower: 1 } }
    )
    
    // ✅ Enhanced notification with detailed logging
    const notificationRoom = `notif:${targetId}`;
    const notification = await Notification.create({
        toUserId: targetId,
        type: "follow",
        message: `User ${userId} started following you`,
        userId: userId,
        image: req.user_profile_image,
    });

    io.to(notificationRoom).emit("receive_notification", notification);

    return res.status(200).json(
        new ApiResponse(200, follow, "followed successfully")
    )
})

const isFollower = asyncHandler(async (req, res) => {
    const { targetId } = req.params;
    const userId = req.userId;
    if (targetId == userId) {
        return res.json({
            "follows": undefined
        })
    }

    const follows = await Follow.findOne({
        followed_by: userId,
        followed_to: targetId
    });

    if (!follows) {
        return res.json({
            "follows": false
        });
    }

    return res.json({
        "follows": true
    });
});

const unfollowUser = asyncHandler(async (req, res) => {
    const { targetId } = req.params
    const userId = req.userId

    const unfollow = await Follow.findOneAndDelete({
        followed_by: userId,
        followed_to: targetId
    });

    if (!unfollow) {
        return res.status(404).json({ message: "Follow not found" });
    }


    await User.findByIdAndUpdate(
        userId,
        {
            $inc: {
                no_of_following: -1
            }
        }
    )
    await User.findByIdAndUpdate(
        targetId,
        {
            $inc: {
                no_of_follower: -1
            }
        }
    )


    return res.status(200).json(
        new ApiResponse(200, unfollow, "Unfollowed successfully")
    )

})

const followerList = asyncHandler(async (req, res) => {
    const userID = req.userId;

    const followers = await Follow.aggregate([
        {
            $match: { followed_to: userID }
        },
        {
            $lookup: {
                from: "users", // The collection to join with
                localField: "followed_by", // Field in Follow collection
                foreignField: "_id", // Field in User collection
                as: "followerData"
            }
        },
        {
            $unwind: "$followerData" // Convert array to object
        },
        {
            $lookup: {
                from: "follows",
                let: { followerId: "$followerData._id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$followed_to", "$$followerId"] },
                                    { $eq: ["$followed_by", userID] }
                                ]

                            }
                        }
                    }
                ],
                as: "isFollowing"
            }
        },
        {
            $project: {
                _id: "$followerData._id",
                userName: "$followerData.userName",
                fullName: "$followerData.fullName",
                profile_image: "$followerData.profile_image",
                isFollowing: { $gt: [{ $size: "$isFollowing" }, 0] }

            }
        }
    ]);

    if (!followers) {
        throw new ApiError(404, "No followers found");
    }

    return res.status(200).json(
        new ApiResponse(200, followers, "Fetched followers successfully")
    );



})

const followingList = asyncHandler(async (req, res) => {
    const userID = req.userId;

    const following = await Follow.aggregate(
        [
            {
                $match: { followed_by: userID }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "followed_to",
                    foreignField: "_id",
                    as: "followingData"

                }
            },
            {
                $unwind: "$followingData"
            },
            {
                $addFields: {
                    isFollowing: true
                },
            },
            {
                $project: {
                    _id: "$followingData._id",
                    userName: "$followingData.userName",
                    fullName: "$followingData.fullName",
                    profile_image: "$followingData.profile_image",
                    isFollowing: 1

                }
            }
        ]
    )

    if (!following) {
        throw new ApiError(404, "No followings found");
    }

    return res.status(200).json(
        new ApiResponse(200, following, "Fetched followeings successfully")
    );

})

export { followUser, isFollower, unfollowUser, followingList, followerList }