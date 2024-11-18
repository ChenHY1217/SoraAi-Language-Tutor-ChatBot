import User from "../models/User.js";
import Quiz from "../models/Quiz.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import generateQuizQuestions from "../gptRequests/generateQuiz.js";

// @desc    Create a quiz
// @route   POST /api/quizzes/create
// @access  Private
const createQuiz = asyncHandler(async (req, res) => {
    try {
        const { language, vocabLvl, grammarLvl } = req.body;
        const userId = req.user._id;

        // Generate questions using GPT
        const questions = await generateQuizQuestions(language, vocabLvl, grammarLvl);

        // Create a title based on the language and levels
        const title = `${language} Quiz - Vocab: ${vocabLvl}, Grammar: ${grammarLvl}`;

        // Create a new quiz
        const quiz = await Quiz.create({
            userId,
            title,
            language,
            questions
        });

        res.status(201).json(quiz);
    } catch (error) {
        console.error('Error in createQuiz:', error);
        res.status(400).json({ message: error.message });
    }
});