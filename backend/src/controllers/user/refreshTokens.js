import { User } from "../../models/user.model.js"
import jwt from "jsonwebtoken"
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import generateAccessAndRefreshToken from "./generateTokens.js";

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken ||
        req.body.refreshToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    console.log("=== REFRESH TOKEN REQUEST ===");
    console.log("Has refresh token:", !!incomingRefreshToken);

    if (!incomingRefreshToken)
        throw new ApiError(401, "Unauthorized request - No refresh token")
    
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        console.log("✅ Refresh token verified, user ID:", decodedToken._id);

        const user = await User.findById(decodedToken._id)

        if (!user) {
            console.log("❌ User not found");
            throw new ApiError(400, "Invalid refresh token")
        }

        console.log("DB token matches:", user.refreshToken === incomingRefreshToken);

        if (user?.refreshToken !== incomingRefreshToken) {
            console.log("❌ Token mismatch");
            throw new ApiError(401, "Refresh token is outdated")
        }

        const accessToken = await user.generateAccessToken()
        console.log("✅ New access token generated");

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            maxAge: 1 * 24 * 60 * 60 * 1000
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .json(
                new ApiResponse(200, { accessToken }, "Access token refreshed")
            )

    } catch (error) {
        console.error("❌ Refresh error:", error.message);
        if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, "Refresh token expired")
        }
        throw new ApiError(401, error?.message || "Refresh token is invalid")
    }
})

export { refreshAccessToken }