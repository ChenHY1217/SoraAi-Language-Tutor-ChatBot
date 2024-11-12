import express from "express";

// Controllers
import { getUserChats, createChat, continueChat, getChatById, getChatMessages } from "../controllers/ChatControllers.js";

// Middlewares
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
    .get(authenticate, getUserChats)
    .post(authenticate, createChat);

router.route("/:id")
    .get(authenticate, getChatById)
    .patch(authenticate, continueChat);

router.get("/:id/messages", authenticate, getChatMessages);

export default router;