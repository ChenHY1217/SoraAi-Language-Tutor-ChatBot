import axios from "axios";
import OpenAI from "openai";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// OpenAI API Key
dotenv.config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Function to test the GPT model
const testGPT = asyncHandler(async (req, res) => {
    try {
        const { message } = req.body;
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a helpful language tutor." },
                {
                    role: "user",
                    content: message,
                },
            ],
        });

        res.json({
            message: response.choices[0].message,
            response
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

// Function to generate a summary title for a chat session
const generateSummaryTitle = async (messages) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful language tutor." },
                {
                    role: "user",
                    content: `This is the beginning of a conversation with you.
                        The following message is the first message to a series of messages, requests, or questions
                        revolving around learning a new language. Please consider the following message and respond
                        with a title or summary line representing the potential conversation starting from this message. Your response should 
                        only be that of a title or summary line. Do not use quotation marks in your response.
                        This is the message: ${messages[0]}`,
                },
            ],
        });

        return response.choices[0].message.content.trim().toUpperCase().replace(/['"]/g, '');
    } catch (error) {
        console.log(error);
        return "Chat Session";
    }
};

// define a function that waits for the OpenAI's GPT response
const waitingForAIResponse = async (message) => {
    try {
        // Send message to OpenAI's GPT
        
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a helpful language tutor." },
                {
                    role: "user",
                    content: `This following message is the start or continuation of a conversation with you regarding learning a new language.
                        Please consider the following message and respond with a message that would be appropriate for the conversation.
                        If the message has not enough context, please ask for more information.
                        If the message is irrelavant or inappropriate, please respond with a message that would be appropriate for the conversation.
                        This is the message: ${message}`,
                },
            ],
        });

        const botMessage = {
            sender: 'bot',
            message: response.choices[0].message.content,
            timestamp: Date.now(),
        };
        
        return botMessage;

    } catch (error) {
        console.log(error);
        return {
            sender: 'bot',
            message: 'Sorry, I am unable to respond at the moment.',
            timestamp: Date.now(),
        };
    }
};

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

export {
    getUserChats,
    createChat,
    continueChat,
    testGPT,
    getChatById,
    getChatMessages,
};