import { Post } from "../../models/post.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import mongoose from "mongoose";

const getFeedPost = asyncHandler(async (req, res) => {
    const posts = await Post.aggregate([
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "createdBy",
                as: "creator"
            }
        },
        {
            $unwind: "$creator"
        },
        {
            $project: {
                content: 1,
                media: 1,
                no_of_like: 1,
                no_of_comment: 1,
                createdAt: 1,
                "creator.userName": 1,
                "creator.profile_image": 1,
                "creator._id": 1
            }
        }
    ])

    if (!posts) throw new ApiError(500, "failed to fetch posts")

    return res.status(200).json(
        new ApiResponse(200, posts, "posts fetched successfully")
    )
})

const getCurrentUserPost = asyncHandler(async (req, res) => {
    const posts = await Post.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(String(req.userId))
            }
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "createdBy",
                as: "creator"
            }
        },
        {
            $unwind: "$creator"
        },
        {
            $project: {
                content: 1,
                media: 1,
                no_of_like: 1,
                no_of_comment: 1,
                createdAt: 1,
                "creator.userName": 1,
                "creator.profile_image": 1,
                "creator._id": 1
            }
        }
    ])

    if (!posts) throw new ApiError(500, "failed to fetch posts")

    return res.status(200).json(
        new ApiResponse(200, posts, "posts fetched successfully")
    )
})

const getUserPost = asyncHandler(async (req, res) => {
    const {targetId} = req.params
    const posts = await Post.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(String(targetId))
            }
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "createdBy",
                as: "creator"
            }
        },
        {
            $unwind: "$creator"
        },
        {
            $project: {
                content: 1,
                media: 1,
                no_of_like: 1,
                no_of_comment: 1,
                createdAt: 1,
                "creator.userName": 1,
                "creator.profile_image": 1,
                "creator._id": 1
            }
        }
    ])

    if (!posts) throw new ApiError(500, "failed to fetch posts")

    return res.status(200).json(
        new ApiResponse(200, posts, "posts fetched successfully")
    )
})

export { getFeedPost, getCurrentUserPost, getUserPost }