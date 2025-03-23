import { Post } from "../../models/post.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import mongoose from "mongoose";
import { Like } from "../../models/like.model.js";

const getFeedPost = asyncHandler(async (req, res) => {
    const posts = await Post.aggregate([
        { $sort: { createdAt: -1 } },
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
        { $sort: { createdAt: -1 } },
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
    const { targetId } = req.params
    const posts = await Post.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(String(targetId))
            }
        },
        { $sort: { createdAt: -1 } },
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

const getPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const postExist = await Post.findById(postId)
    if (!postExist) throw new ApiError(404, "post nt exist")
    const post = await Post.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(String(postId))
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

    if (!post) throw new ApiError(500, "failed to fetch post")

    return res.status(200).json(
        new ApiResponse(200, post, "post fetched successfully")
    )
})

const getLikedPost = asyncHandler(async (req, res) => {
    const userId = req.userId

    const posts = await Like.aggregate([
        {
            $match: {
                liked_by: userId
            }
        },
        { $sort: { createdAt: -1 } },
        {
            $lookup: {
                from: "posts",
                foreignField: "_id",
                localField: "liked_on",
                as: "posts"
            }
        },
        { $unwind: "$posts" },
        {
            $replaceRoot: { newRoot: "$posts" } // Extract only the post details
        },
        {
            $lookup: {
                from: "users", // Assuming the authors are stored in a "users" collection
                foreignField: "_id",
                localField: "createdBy", // Assuming "user" in posts refers to a user _id
                as: "creator"
            }
        },
        { $unwind: "$creator" }, // Convert user array into an object
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

    if (!posts) throw new ApiError(500, "failed to fetch liked post")

    return res.status(200).json(
        new ApiResponse(200, posts, "post fetched successfully")
    )


})

export { getFeedPost, getCurrentUserPost, getUserPost, getPost, getLikedPost }