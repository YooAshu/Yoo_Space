import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import generateAccessAndRefreshToken from "./generateTokens.js";

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (
        [email, password].some((field) =>
            field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "all fields are required")
    }

    const registeredUser = await User.findOne({ email })
    if (!registeredUser) {
        throw new ApiError(404, "user not found")
    }

    const isPasswordValid = await registeredUser.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "incorrect email or password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(registeredUser._id)

    const loggedInUser = await User.findById(registeredUser._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    // console.log(accessToken, refreshToken);

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "user loggeid successfully"
            )
        )


})

export default loginUser