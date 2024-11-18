import Chat from "../models/Chat.js";
import User from "../models/User.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import generateSummaryTitle from "../gptRequests/generateTitle.js";
import { waitingForAIResponse } from "../gptRequests/aiResponse.js";

// @desc    Get 20 most recent chats for a user
// @route   GET /api/chats
// @access  Private
const getUserChats = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate({
            path: "chatHistory",
            options: { sort: { createdAt: -1 }, limit: 20 },
        });
        res.json({
            username: user.username,
            email: user.email,
            chatHistory: user.chatHistory,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get a single chat session
// @route   GET /api/chats/:id
// @access  Private
const getChatById = asyncHandler(async (req, res) => {
    try {
        const chatId = req.params.id;
        const userId = req.user._id;
        
        // Enhanced query with proper error handling
        const chat = await Chat.findById(chatId).exec();
        
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // Check if user is authorized to view chat
        if (chat.userId.toString() !== userId.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        res.json(chat);
    } catch (error) {
        console.error('Error in getChatById:', error);
        // Check for invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid chat ID" });
        }
        res.status(500).json({ message: "Server error" });
    }
});

// @desc    Get the messages of a single chat session
// @route   GET /api/chats/:id/messages
// @access  Private

const getChatMessages = asyncHandler(async (req, res) => {
    try {
        const chatId = req.params.id;
        const userId = req.user._id;
        const chat = await Chat.findById(chatId);

        // Check if user is authorized to view chat
        if (chat.userId.toString() !== userId.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        res.json(chat.messages);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

// @desc    Create a new chat
// @route   POST /api/chats/create
// @access  Private
const createChat = asyncHandler(async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);

        // Create a new chat session
        const chat = new Chat({
            userId: userId,
            title: await generateSummaryTitle([message]),
            messages: [{ sender: "user", message: message, timestamp: Date.now() }],
        });

        await chat.save();

        // Update user's chat history
        user.chatHistory.push(chat._id);
        await user.save();

        // Send user message to OpenAI's GPT
        const botMessage = await waitingForAIResponse(message);

        // Update chat session with bot response
        chat.messages.push(botMessage);
        await chat.save();

        res.json(chat);

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

// @desc    Continue chat session
// @route   PATCH /api/chats/:id
// @access  Private

const continueChat = asyncHandler(async (req, res) => {
    try {
        const { message } = req.body;
        const chatId = req.params.id;
        const chat = await Chat.findById(chatId);
        const userId = req.user._id;

        // Check if user is authorized to continue chat
        if (chat.userId.toString() !== userId.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Update chat session with user message
        chat.messages.push({ sender: "user", message: message, timestamp: Date.now() });
        await chat.save();

        // Send user message to OpenAI's GPT with previous messages context
        const botMessage = await waitingForAIResponse(message, chat.messages.slice(0, -1));

        // Update chat session with bot response
        chat.messages.push(botMessage);
        await chat.save();

        res.json(chat);

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a chat session
// @route   DELETE /api/chats/:id
// @access  Private
const deleteChatById = asyncHandler(async (req, res) => {
    try {
        const chatId = req.params.id;
        const userId = req.user._id;
        const chat = await Chat.findById(chatId);

        // Check if user is authorized to delete chat
        if (chat.userId.toString() !== userId.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Remove chat from user's chat history
        const user = await User.findById(userId);
        user.chatHistory = user.chatHistory.filter(chat => chat.toString() !== chatId);
        await user.save();

        // Delete chat session
        await Chat.findByIdAndDelete(chatId);

        res.json({ message: "Chat deleted" });

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

// @desc    Clear chat history
// @route   DELETE /api/chats
// @access  Private
const clearChatHistory = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete all chats belonging to the user
        await Chat.deleteMany({ userId: userId });

        // Clear the user's chat history array
        user.chatHistory = [];
        await user.save();

        res.json({ message: "Chat history cleared successfully" });
        
    } catch (error) {
        console.error('Error in clearChatHistory:', error);
        res.status(500).json({ message: "Failed to clear chat history" });
    }
});

export {
    getUserChats,
    createChat,
    continueChat,
    getChatById,
    getChatMessages,
    deleteChatById,
    clearChatHistory,
};