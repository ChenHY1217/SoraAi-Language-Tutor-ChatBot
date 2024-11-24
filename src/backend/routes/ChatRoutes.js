import express from "express";

// Controllers
import {
    getUserChats,
    createChat,
    continueChat,
    getChatById,
    getChatMessages,
    deleteChatById,
    clearChatHistory,
} from "../controllers/ChatControllers.js";

// Middlewares
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getUserChats);
router.delete("/", authenticate, clearChatHistory);
router.post("/create", authenticate, createChat);

router.route("/:id")
    .get(authenticate, getChatById)
    .delete(authenticate, deleteChatById)
    .patch(authenticate, continueChat);

router.get("/:id/messages", authenticate, getChatMessages);

export default router;