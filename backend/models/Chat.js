import mongoose from "mongoose";

// Schema for chat
// Stores the user ID and messages
const chatSchema = new mongoose.Schema({
    // Corresponding user ID
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Users', // Ensure the model name matches the one used in User.js
        required: true 
    },
    // Title of the chat session
    title: { 
        type: String, 
        required: true 
    },
    language: {
        type: String,
        required
    },
    // Array of messages, each containing a sender and message
    messages: [
        {
            sender: { 
                type: String, 
                enum: ['user', 'bot'], 
                required: true 
            },
            message: { 
                type: String, 
                required: true 
            },
            timestamp: { 
                type: Date, 
                default: Date.now
            }
        }
    ]
}, { timestamps: true });

const Chat = mongoose.model('Chats', chatSchema); // Ensure the model name matches the one used in ChatControllers.js

export default Chat;
