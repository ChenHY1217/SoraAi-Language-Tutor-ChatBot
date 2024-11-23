import mongoose from 'mongoose';

// Schema for the quiz
// Stores the quiz's title, questions, and answers
const quizSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['grammar', 'vocab'],
        required: true
    },
    level:{
        type: Number,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    questions: [{
        question: {
            type: String,
            required: true
        },
        choices: [String], // Array of strings for choices
        answer: { // The correct answer
            type: String,
            required: true
        },
        explanation: { // Explanation why the answer is correct
            type: String,
            required: true
        }, 
    }],
    score: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });

const Quiz = mongoose.model('Quizzes', quizSchema);

export default Quiz;