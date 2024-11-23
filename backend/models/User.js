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
    targetLanguages: [{
        language: {
            type: String,
            required: true
        },
        learningProgress: {
            vocabularyLvl: {
                type: Number,
                default: 0,
                min: 0,
                max: 10
            },
            vocabularyProgress: {
                type: Number,
                default: 0,
                min: 0,
                max: 1
            },
            grammarLvl: {
                type: Number,
                default: 0,
                min: 0,
                max: 10
            },
            grammarProgress: {
                type: Number,
                default: 0,
                min: 0,
                max: 1
            },
        }
    }],
    chatHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chats' }], // Ensure the model name matches the one used in Chat.js
    quizHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quizzes' }], // Ensure the model name matches the one used in Quiz.js
    isAdmin: { 
        type: Boolean, 
        required: true, 
        default: false 
    },
    resetPasswordToken: {
        type: String,
        required: false
    },
    resetPasswordExpire: {
        type: Date,
        required: false
    }
}, { timestamps: true });

const User = mongoose.model('Users', userSchema);

export default User;