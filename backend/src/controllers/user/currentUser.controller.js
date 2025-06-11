import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const currentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId).select("-password -refreshToken")
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "user fetched successfully"
            )
        )
})

const getCurrentUserBytoken = asyncHandler(async (req, res) => {
    const userId = req.userId
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { userId },
                "userID fetched successfully"
            )
        )
})


export default currentUser
export { getCurrentUserBytoken };