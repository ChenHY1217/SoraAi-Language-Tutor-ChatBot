import express from "express";

// Controllers
import { getUserChats, createChat, continueChat, testGPT } from "../controllers/ChatControllers.js";

// Middlewares
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
    .get(authenticate, getUserChats)
    .post(authenticate, createChat)
    .patch(authenticate, continueChat);




export default router;