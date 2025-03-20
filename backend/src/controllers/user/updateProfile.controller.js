import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../../utils/cloudinary.js";

const updateProfile = asyncHandler(async (req, res) => {
    const { userName, fullName, bio } = req.body;

    // console.log("Files Received:", req.files);
    // console.log("Form Data Received:", req.body);

    // Ensure userId exists
    if (!req.userId) {
        throw new ApiError(400, "User ID is missing from request");
    }
    const user = await User.findById(req.userId)
    if (!user)
        throw new ApiError(404, "user not found")

    let oldProfile = user.profile_image || null;
    let oldCover = user.cover_image || null;

    let updates = {};  // Object to store fields that need updating

    // Only add fields if they exist in request body
    if (userName) {
        const existingUserName = await User.findOne({ userName: userName })
        if (existingUserName) throw new ApiError(403, "user name already exist")
        updates.userName = userName;
    }
    if (fullName) updates.fullName = fullName;
    if (bio) updates.bio = bio;

    // Handle Profile & Cover Image Uploads
    if (req.files?.profileImage?.length > 0) {
        const profileImageUpload = await uploadOnCloudinary(req.files.profileImage[0].path);
        if (!profileImageUpload) {
            throw new ApiError(500, "Failed to upload profile picture");
        }
        updates.profile_image = profileImageUpload.secure_url;
    }

    if (req.files?.coverImage?.length > 0) {
        const coverImageUpload = await uploadOnCloudinary(req.files.coverImage[0].path);
        if (!coverImageUpload) {
            throw new ApiError(500, "Failed to upload cover image");
        }
        updates.cover_image = coverImageUpload.secure_url;
    }

    if (Object.keys(updates).length === 0) {
        return res.status(400).json(new ApiResponse(400, null, "No changes detected"));
    }

    // Update User in DB
    const updatedUser = await User.findByIdAndUpdate(req.userId, updates, { new: true });

    if (!updatedUser) {
        throw new ApiError(500, "Failed to update user");
    }

    if (updates.profile_image && oldProfile) {
        const publicId = oldProfile.split("/").pop().split(".")[0]
        try {
            await deleteFromCloudinary(publicId)
        } catch (error) {
            console.log("error deleting old cover image")
        }
    }

    if (updates.cover_image && oldCover) {
        const publicId = oldCover.split("/").pop().split(".")[0]
        try {
            await deleteFromCloudinary(publicId)
        } catch (error) {
            console.log("error deleting old cover image")
        }
    }

    res.status(201).json(new ApiResponse(201, updatedUser, "User updated successfully"));
});

export { updateProfile };
