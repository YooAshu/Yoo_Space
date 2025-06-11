import { Router } from "express";
import registerUser from "../controllers/user/registration.controller.js";
import loginUser from "../controllers/user/userLogin.controller.js";
import zodValidate from "../middleware/zodValidate.js";
import { registrationSchema } from "../validators/registration.schema.js";
import { loginSchema } from "../validators/login.schema.js";
import { profileUpdateSchema } from "../validators/profileUpdate.schema.js";
import verifyJWT from "../middleware/auth.middleware.js";
import currentUser, { getCurrentUserBytoken } from "../controllers/user/currentUser.controller.js";
import logout from "../controllers/user/logout.controller.js";
import discoverUsers from "../controllers/user/discoverUsers.js";
import { followUser, isFollower, unfollowUser, followerList, followingList } from "../controllers/user/follow.controller.js";
import { updateProfile } from "../controllers/user/updateProfile.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { getUser ,getFollowers,getFollowings } from "../controllers/user/getUser.controller.js";

const router = Router();


router.route('/register').post(zodValidate(registrationSchema), registerUser)
router.route('/login').post(zodValidate(loginSchema), loginUser)

// protected route
router.route('/current-user').get(verifyJWT, currentUser)
router.route('/current-user-by-token').get(verifyJWT, getCurrentUserBytoken)
router.route('/logout').post(verifyJWT, logout)
router.route('/discover').get(verifyJWT, discoverUsers)
router.route('/follow/:targetId').patch(verifyJWT, followUser)
router.route('/unfollow/:targetId').patch(verifyJWT, unfollowUser)
router.route('/is-follower/:targetId').get(verifyJWT, isFollower)
router.route('/followers').get(verifyJWT, followerList)
router.route('/followings').get(verifyJWT, followingList)
router.route('/update-profile').patch(
    verifyJWT,
    upload.fields([
        {
            name: "profileImage",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    zodValidate(profileUpdateSchema),
    updateProfile
)
router.route('/profile/:userId').get(verifyJWT, getUser)
router.route('/followers/:userId').get(verifyJWT, getFollowers)
router.route('/followings/:userId').get(verifyJWT, getFollowings)

export default router