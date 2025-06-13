import { User } from "../../models/user.model.js"
import jwt from "jsonwebtoken"
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import generateAccessAndRefreshToken from "./generateTokens.js";

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken)
        throw new ApiError(401, "unnautorized request")
    try {

        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken._id)

        if (!user)
            throw new ApiError(400, "invalid refresh token")

        if (user?.refreshToken !== incomingRefreshToken)
            throw new ApiError(401, "refresh token is outdated")

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none" 
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(200,
                    {
                        accessToken,
                        refreshToken: newRefreshToken
                    },
                    "access token refreshed")
            )


    } catch (error) {
        throw new ApiError(401, error?.message || "refresh token is invalid")
    }
})

export {refreshAccessToken}