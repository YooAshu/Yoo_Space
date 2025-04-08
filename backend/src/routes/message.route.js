import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { getAllConversations, getConversation } from "../controllers/message/conversation.controller.js";
import { getAllMessages, sendMessage } from "../controllers/message/message.controller.js";

const router = Router();

router.route("/conversation/:targetId").get(verifyJWT, getConversation);
router.route("/send/:conversationId").post(verifyJWT, sendMessage);
router.route("/all-messages/:conversationId").get(verifyJWT, getAllMessages);
router.route("/all-conversation").get(verifyJWT, getAllConversations);

export default router;