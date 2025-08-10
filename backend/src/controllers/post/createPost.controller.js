import { asyncHandler } from "../../utils/asyncHandler.js";
import { Post } from "../../models/post.model.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const createPost = asyncHandler(async (req, res) => {
    const { content, aspectRatio } = req.body;
    const mediaFiles = req.files?.media;
    //console.log("body",req.body);
    //console.log("files",req.files);


    if (!content && !mediaFiles) {
        throw new ApiError(400, "Either post content or media is required");
    }

    const userId = req.userId;

    const post = {
        content: content || "",
        media: [],
        createdBy: userId,
        aspectRatio: aspectRatio || 1.0
    };

    if (mediaFiles?.length > 0) {
        try {
            post.media = await Promise.all(
                mediaFiles.map(async (image) => {
                    const postUpload = await uploadOnCloudinary(image.path);
                    if (!postUpload) throw new Error("Cloudinary upload failed");
                    return postUpload.secure_url;
                })
            );
        } catch (error) {
            throw new ApiError(500, "Failed to upload one or more files to Cloudinary");
        }
    }

    const createdPost = await Post.create(post);
    if (!createdPost) {
        throw new ApiError(500, "Failed to create post");
    }

    await User.findByIdAndUpdate(
        userId,
        {
            $inc:{
                no_of_post:1
            }
        }
    )

    return res.status(200).json(new ApiResponse(200, createdPost, "Post created successfully"));
});

export default createPost;
