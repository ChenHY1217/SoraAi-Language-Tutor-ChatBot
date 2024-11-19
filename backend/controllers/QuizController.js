import User from "../models/User.js";
import Quiz from "../models/Quiz.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import generateQuizQuestions from "../gptRequests/generateQuiz.js";

// @desc    Get all quizzes for a specific language
// @route   GET /api/quizzes/:lang
// @access  Private
const getQuizzes = asyncHandler(async (req, res) => {
    try {
        const language = req.params.lang;
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const quizzes = await Quiz.find({ userId, language });

        res.status(200).json(quizzes);

    } catch (error) {
        console.error('Error in getQuizzes:', error);
        res.status(400).json({ message: error.message });
    }
});

// @desc    Create a quiz
// @route   POST /api/quizzes/create
// @access  Private
const createQuiz = asyncHandler(async (req, res) => {
    try {
        const { language, vocabLvl, grammarLvl } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

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

        await quiz.save();

        user.quizHistory.push(quiz._id);
        await user.save();

        res.status(201).json(quiz);

    } catch (error) {
        console.error('Error in createQuiz:', error);
        res.status(400).json({ message: error.message });
    }
});

// @desc    answer a quiz
// @route   POST /api/quizzes/answer
// @access  Private
const answerQuiz = asyncHandler(async (req, res) => {
    try {
        const { quizId, answers } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        let score = 0;

        for (let i = 0; i < answers.length; i++) {

            if (answers[i] === quiz.questions[i].answer) {
                score++;
            }

        }

        quiz.score = score;
        await quiz.save();

        res.status(200).json({
            questions: quiz.questions,
            score           
        });

    } catch (error) {
        console.error('Error in answerQuiz:', error);
        res.status(400).json({ message: error.message });
    }
});


export { createQuiz };