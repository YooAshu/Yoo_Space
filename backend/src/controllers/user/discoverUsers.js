import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js"
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Follow } from "../../models/follow.model.js";

const discoverUsers = asyncHandler(async (req, res) => {

    const getFollowings = await Follow.find({
        followed_by: req.userId
    })

    // Extract the user IDs that the current user is following
    const followingIds = getFollowings.map(follow => follow.followed_to);

    // Add the current user's ID to the exclusion list
    const excludeIds = [...followingIds, req.userId];

    const users = await User.find(
        {
            isAdmin: false,
            _id: { $nin: excludeIds }, // Exclude current user

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


const searchUser = asyncHandler(async (req, res) => {
    const { inputValue } = req.body
    //console.log("inputValue", inputValue);
    if (!inputValue || inputValue.trim() === "") {
        throw new ApiError(400, "Input value is required");
    }
    
    const users = await User.find(
        {
            isAdmin: false,
            _id: { $nin: req.userId }, // Exclude current user
            // user which have inputValue in ther userName or fullName
            $or: [
                { userName: { $regex: inputValue, $options: 'i' } },
                { fullName: { $regex: inputValue, $options: 'i' } }
            ]
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
export { searchUser };