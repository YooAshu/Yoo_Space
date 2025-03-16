import { User } from '../../models/user.model.js'
import { ApiError } from '../../utils/ApiError.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { ApiResponse } from '../../utils/ApiResponse.js'

const registerUser = asyncHandler(async (req, res) => {
    // console.log(req.body); 
    
    const { userName, fullName, email, password } = req.body

    if (
        [userName, email, fullName, password].some((field) =>
            field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "all fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { userName }]
    })

    if (existedUser) {
        throw new ApiError(409, "User Already Exist")
    }

    const user = await User.create({
        userName,
        fullName,
        email,
        password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "failed to register user please try again")
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )

})

export default registerUser