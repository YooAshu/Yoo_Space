import mongoose from "mongoose";
import { Follow } from "../../models/follow.model.js";
import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";

const ObjectId = mongoose.Types.ObjectId;

const getUser = asyncHandler(async (req, res) => {
    const { userId } = req.params


    // //console.log(userId);

    const user = await User.findById(userId).select("-password -refreshToken")

    if(!user) throw new ApiError(404,"user not found")
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "user fetched successfully"
            )
        )
})

const getFollowers = asyncHandler(async (req, res) => {
    const { userId } = req.params
    const loggedInUserId = req.userId;
    const followers = await Follow.aggregate([
        {
            $match: { followed_to:  new mongoose.Types.ObjectId(String(userId)) } // Convert to ObjectId
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
            $unwind: "$followerData"
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
                                    {$eq: ["$followed_to", "$$followerId"]},
                                    {$eq: ["$followed_by", loggedInUserId]}
                                ]

                            }
                        }
                    }
                ],
                as:"isFollowing"
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
    ])
    if (!followers) {
        throw new ApiError(404, "No followers found");
    }

    return res.status(200).json(
        new ApiResponse(200, followers, "Fetched followers successfully")
    );
})


const getFollowings = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const loggedInUserId = req.userId;
    // //console.log(userId);

    const following = await Follow.aggregate(
        [
            {
                $match: { followed_by:  new mongoose.Types.ObjectId(String(userId)) } // Convert to ObjectId
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
            $lookup: {
                from: "follows",
                let: { followingId: "$followingData._id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {$eq: ["$followed_to", "$$followingId"]},
                                    {$eq: ["$followed_by", loggedInUserId]}
                                ]

                            }
                        }
                    }
                ],
                as:"isFollowing"
            }
        },
            {
                $project: {
                    _id: "$followingData._id",
                    userName: "$followingData.userName",
                    fullName: "$followingData.fullName",
                    profile_image: "$followingData.profile_image",
                    isFollowing: { $gt: [{ $size: "$isFollowing" }, 0] }
                }
            }
        ]
    )

    

    if (!following) {
        throw new ApiError(404, "No followings found");
    }
    // //console.log(following);


    return res.status(200).json(
        new ApiResponse(200, following, "Fetched followeings successfully")
    );

})


export { getUser, getFollowers, getFollowings }