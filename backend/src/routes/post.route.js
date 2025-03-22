import { Router } from "express";
import createPost from "../controllers/post/createPost.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import verifyJWT from "../middleware/auth.middleware.js";
import { getCurrentUserPost, getFeedPost,getUserPost } from "../controllers/post/getFeedPost.js";
import { isLiked, likePost, unLikePost } from "../controllers/post/likePost.controller.js";

const router = Router();

router.route('/user/:targetId').get(getUserPost)

router.route('/create').post(verifyJWT,upload.fields([
    {
        name: "media",
        maxCount: 3
    }
]), createPost)
router.route('/feed').get(verifyJWT,getFeedPost)
router.route('/currentUser').get(verifyJWT,getCurrentUserPost)
router.route('/like/:postId').patch(verifyJWT,likePost)
router.route('/unlike/:postId').patch(verifyJWT,unLikePost)
router.route('/is-liked/:postId').get(verifyJWT, isLiked)

export default router