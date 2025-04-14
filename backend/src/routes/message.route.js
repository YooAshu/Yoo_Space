import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { AcceptGroupInvite, createGroup, getAllConversations, getConversation,getConversationById, getGroupInvites } from "../controllers/message/conversation.controller.js";
import { getAllMessages, sendMessage, setMessagesAsRead } from "../controllers/message/message.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/conversation/:targetId").get(verifyJWT, getConversation);
router.route("/conversation-id/:conversationId").get(verifyJWT, getConversationById);
router.route("/send/:conversationId").post(verifyJWT, sendMessage);
router.route("/all-messages/:conversationId").get(verifyJWT, getAllMessages);
router.route("/all-conversation").get(verifyJWT, getAllConversations);
router.route("/set-read/:messageId").patch(verifyJWT, setMessagesAsRead);
router.route("/create-group").post(verifyJWT,
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },]),
    createGroup);
router.route("/group-invites").get(verifyJWT, getGroupInvites);
router.route("/group-invite-accept/:conversationId").patch(verifyJWT, AcceptGroupInvite);

export default router;