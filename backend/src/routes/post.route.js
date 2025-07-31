import { Router } from "express";
import createPost from "../controllers/post/createPost.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import verifyJWT from "../middleware/auth.middleware.js";
import { getCurrentUserPost, getFeedPost, getLikedPost, getPost, getUserPost } from "../controllers/post/getFeedPost.js";
import { getWhoLiked, isLiked, likePost, unLikePost } from "../controllers/post/likePost.controller.js";
import { createComment, getComment ,likeComment,unLikeComment,isCommentLiked} from "../controllers/post/comments.controller.js";

const router = Router();

router.route('/user/:targetId').get(verifyJWT,getUserPost)
router.route('/comments/:postId').get(verifyJWT,getComment)

router.route('/create').post(verifyJWT, upload.fields([
    {
        name: "media",
        maxCount: 3
    }
]), createPost)
router.route('/feed').get(verifyJWT, getFeedPost)
router.route('/post/:postId').get(verifyJWT, getPost)
router.route('/currentUser').get(verifyJWT, getCurrentUserPost)
router.route('/user-likes').get(verifyJWT, getLikedPost)

router.route('/like/:postId').patch(verifyJWT, likePost)
router.route('/unlike/:postId').patch(verifyJWT, unLikePost)
router.route('/is-liked/:postId').get(verifyJWT, isLiked)
router.route('/likes-on/:postId').get(getWhoLiked)

router.route('/comment-on/:postId').post(verifyJWT,createComment)
router.route('/comment/like/:commentId').patch(verifyJWT, likeComment)
router.route('/comment/unlike/:commentId').patch(verifyJWT, unLikeComment)
router.route('/comment/is-liked/:commentId').get(verifyJWT, isCommentLiked)



export default router