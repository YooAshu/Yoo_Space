import { asyncHandler } from "../../utils/asyncHandler.js";
import { Like } from "../../models/like.model.js"
import { Post } from "../../models/post.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import mongoose from "mongoose";

const likePost = asyncHandler(async (req, res) => {
    
    const userId = req.userId

    const { postId } = req.params
    
    const like = await Like.create({
        liked_by: userId,
        liked_on: postId
    })

    if (!like) throw new ApiError(500, "failed to like post")

    await Post.findByIdAndUpdate(
        postId,
        {
            $inc: {
                no_of_like: 1
            }
        }
    )

    return res.status(200).json(
        new ApiResponse(200, like, "liked post successfully")
    )

})
const unLikePost = asyncHandler(async (req, res) => {
    const userId = req.userId

    const { postId } = req.params

    const like = await Like.findOneAndDelete({
        liked_by: userId,
        liked_on: postId
    })

    if (!like) throw new ApiError(500, "failed to unlike post")

    await Post.findByIdAndUpdate(
        postId,
        {
            $inc: {
                no_of_like: -1
            }
        }
    )

    return res.status(200).json(
        new ApiResponse(200, like, "unliked post successfully")
    )

})

const isLiked = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    
    const userId = req.userId;

    const liked = await Like.findOne({
        liked_by: userId,
        liked_on: postId
    });

    if (!liked) {
        return res.json({
            "liked": false
        });
    }

    return res.json({
        "liked": true
    });
});

const getWhoLiked = asyncHandler(async(req,res)=>{
    const {postId} = req.params;

    const likedBy = await Like.aggregate([
        {
            $match:{
                liked_on: new mongoose.Types.ObjectId(String(postId))
            }
        },
        { $sort: { createdAt: -1 } },
        {
            $lookup:{
                from:"users",
                foreignField:"_id",
                localField:"liked_by",
                as:"usersLiked"
            }
        },
        {
            $unwind:"$usersLiked"
        },
        {
            $project:{
                "usersLiked._id":1,
                "usersLiked.userName":1,
                "usersLiked.profile_image":1,
            }
        }
        
    ])

    if(!likedBy) throw new ApiError(500,"failed to fetch user who liked this post")

    return res.status(200).json(
        new ApiResponse(200,likedBy,"fetched user who liked this post successfully")
    )
})
export { likePost, unLikePost, isLiked ,getWhoLiked}