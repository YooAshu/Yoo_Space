import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js"
import { asyncHandler } from "../../utils/asyncHandler.js";

const discoverUsers = asyncHandler(async (req, res) => {
    const users = await User.find(
        {
            isAdmin: false,
            _id: { $ne: req.userId } // Exclude current user
        },
        { _id: 1, fullName: 1, userName: 1, profile_image: 1 }
    );


    if (!users) {
        throw new ApiError(404, "failed to fetch users")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    users
                },
                "fetched users successfully"
            )
        )

})

export default discoverUsers