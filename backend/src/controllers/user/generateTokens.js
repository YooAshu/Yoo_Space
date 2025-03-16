import { User } from "../../models/user.model.js"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user)
            throw new ApiError(404, "user not found")

        const refreshToken = await user.generateRefreshToken()

        const accessToken = await user.generateAccessToken()

        user.refreshToken = refreshToken

        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating access token and refresh token")
    }
}

export default generateAccessAndRefreshToken