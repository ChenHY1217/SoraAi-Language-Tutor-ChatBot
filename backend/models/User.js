import mongoose from "mongoose";

// Schema for the user
// Stores the user's username, email, password, target languages, learning progress, chat history, and admin status
const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    targetLanguages: [String],
    learningProgress: {
        vocabulary: Number,
        grammarLevel: Number,
    },
    chatHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
    isAdmin: { 
        type: Boolean, 
        required: true, 
        default: false 
    }
}, { timestamps: true });

const User = mongoose.model('Users', userSchema);

export default User;