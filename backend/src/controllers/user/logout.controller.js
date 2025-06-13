import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.userId,
        {
            $unset: {
                refreshToken: 1
            }
        }, {
        new: true
    }
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none" 
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "logout successfully"))

})

export default logout