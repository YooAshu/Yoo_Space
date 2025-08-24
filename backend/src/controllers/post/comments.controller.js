import { asyncHandler } from "../../utils/asyncHandler.js";
import { Comment, CommentLike } from "../../models/comment.model.js"
import { Post } from "../../models/post.model.js"
import { User } from "../../models/user.model.js"
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import mongoose from "mongoose";
import { io } from "../../../socket.js";

const getComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const comments = await Comment.aggregate([
        { $sort: { createdAt: -1 } },
        {
            $match: {
                commented_on: new mongoose.Types.ObjectId(String(postId))
            }
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "commented_by",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $lookup: {
                from: "commentlikes",
                let: { commentId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$liked_by", req.userId] },
                                    { $eq: ["$liked_on", "$$commentId"], }
                                ]

                            }
                        }
                    }
                ],
                as: "userLike"
            }
        },
        {
            $project: {
                commented_by: 1,
                content: 1,
                createdAt: 1,
                no_of_like: 1,
                "user._id": 1,
                "user.userName": 1,
                "user.profile_image": 1,
                isLiked: {
                    $gt: [{ $size: "$userLike" }, 0]
                }
            }
        }
    ])

    if (!comments) throw new ApiError(500, "failed to fetch comments")
    return res.status(200).json(
        new ApiResponse(200, comments, "fetched comments successfully")
    )
})

const createComment = asyncHandler(async (req, res) => {
    const { content } = req.body
    if (content == "") throw new ApiError(400, "comment should not be empty")
    const { postId } = req.params;
    const userId = req.userId;


    const comment = await Comment.create({
        commented_by: userId,
        commented_on: postId,
        content
    })
    const user = await User.findById(userId, { _id: 1, userName: 1, profile_image: 1 })
    const post = await Post.findByIdAndUpdate(
        postId,
        {
            $inc: {
                no_of_comment: 1
            }
        }
    )


    if (!comment) throw new ApiError(500, "failed to create comment")

    const notificationRoom = `notif:${post.createdBy}`;
    const notification = await Notification.create({
        toUserId: post.createdBy,
        type: "comment",
        message: `User ${userId} commented on your post`,
        postId: post._id,
        image: req.user_profile_image,
    });

    io.to(notificationRoom).emit("receive_notification", notification);
    return res.status(200).json(
        new ApiResponse(200,
            {
                commented_by: comment.commented_by,
                content: comment.content,
                no_of_like: 0,
                createdAt: comment.createdAt,
                _id: comment._id,
                user

            }, "created comment successfully")
    )

})

const likeComment = asyncHandler(async (req, res) => {

    const userId = req.userId;
    const { commentId } = req.params

    const existingLike = await CommentLike.findOne({
        liked_by: userId,
        liked_on: commentId
    });

    if (existingLike) {
        throw new ApiError(500, "like already exists")
    }

    const like = await CommentLike.create({
        liked_by: userId,
        liked_on: commentId
    })

    if (!like) throw new ApiError(500, "failed to like comment")


    await Comment.findByIdAndUpdate(
        commentId,
        {
            $inc: {
                no_of_like: 1
            }
        }
    )

    return res.status(200).json(
        new ApiResponse(200, like, "liked comment successfully")
    )
})


const unLikeComment = asyncHandler(async (req, res) => {
    const userId = req.userId

    const { commentId } = req.params

    const like = await CommentLike.findOneAndDelete({
        liked_by: userId,
        liked_on: commentId
    })

    if (!like) throw new ApiError(500, "failed to unlike comment")

    await Post.findByIdAndUpdate(
        commentId,
        {
            $inc: {
                no_of_like: -1
            }
        }
    )

    return res.status(200).json(
        new ApiResponse(200, like, "Unliked Comment successfully")
    )

})


const isCommentLiked = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const userId = req.userId;

    const liked = await CommentLike.findOne({
        liked_by: userId,
        liked_on: commentId
    });

    if (!liked) {
        return res.json({
            "liked": false
        });
    }

    return res.json({
        "liked": true
    });
})
export { getComment, createComment, likeComment, isCommentLiked, unLikeComment }