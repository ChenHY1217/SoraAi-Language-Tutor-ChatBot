import mongoose from "mongoose";

// Schema for chat
// Stores the user ID and messages
const chatSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
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
});

const Chat = mongoose.model('Chats', chatSchema);

export default Chat;
