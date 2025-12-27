import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken._id).select("-password -refreshToken")
        
        if (!user) {
            throw new ApiError(401, "Invalid access token")
        }
        
        req.userId = user._id
        req.user_profile_image = user.profile_image
        req.userName = user.userName
        next()

    } catch (error) {
        // Handle JWT specific errors
        if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, "Access token expired")
        } else if (error.name === 'JsonWebTokenError') {
            throw new ApiError(401, "Invalid access token")
        } else {
            throw new ApiError(401, error?.message || "Authentication failed")
        }
    }
})

export default verifyJWT