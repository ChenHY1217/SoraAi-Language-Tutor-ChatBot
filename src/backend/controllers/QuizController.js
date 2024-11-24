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

        const user = req.user;

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
        const { type, language, vocabLvl, grammarLvl } = req.body;
        const userId = req.user._id;

        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find past quizzes for the user testing the same language and levels
        const level = type === 'vocab' ? vocabLvl : grammarLvl;
        const pastQuizzes = await Quiz.find({ userId, language, type, level, 'questions.0.choices.0': { $exists: true } });
        const pastQuizQuestions = pastQuizzes.map((quiz) => quiz.questions);

        // Generate questions using GPT
        const questions = await generateQuizQuestions(pastQuizQuestions, type, language, vocabLvl, grammarLvl);

        // Create a title based on the language and levels
        const title = `${language} ${type} Quiz - Vocab: Lv${vocabLvl}, Grammar: Lv${grammarLvl}`;

        // Create a new quiz
        const quiz = await Quiz.create({
            userId,
            title,
            type,
            level,
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
// @route   PATCH /api/quizzes/:quizId/answer
// @access  Private
const answerQuiz = asyncHandler(async (req, res) => {
    try {
        const quizId = req.params.quizId;
        const { answers } = req.body;

        const user = req.user;

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

        // Progress Update
        const language = quiz.language;
        const type = quiz.type;
        const targetLanguage = user.targetLanguages.find((targetLang) => targetLang.language === language);

        if (!targetLanguage) {
            return res.status(404).json({ message: "Language not found" });
        }

        // Calculate progress points based on score
        let progressPoints = 0;
        if (score === 3) progressPoints = 0.2;
        else if (score === 2) progressPoints = 0.1;

        // Update progress based on type
        const progress = targetLanguage.learningProgress;
        let updatedProgress;

        if (type === 'vocab') {
            updatedProgress = progress.vocabularyProgress + progressPoints;
            if (updatedProgress >= 1.0 && progress.vocabularyLvl < 10) {
                progress.vocabularyLvl += 1;
                progress.vocabularyProgress = 0;
            } else {
                progress.vocabularyProgress = updatedProgress;
            }
        } else if (type === 'grammar') {
            updatedProgress = progress.grammarProgress + progressPoints;
            if (updatedProgress >= 1.0 && progress.grammarLvl < 10) {
                progress.grammarLvl += 1;
                progress.grammarProgress = 0;
            } else {
                progress.grammarProgress = updatedProgress;
            }
        }

        await user.save();

        res.status(201).json(quiz);

    } catch (error) {
        console.error('Error in answerQuiz:', error);
        res.status(400).json({ message: error.message });
    }
});


export { getQuizzes, createQuiz, answerQuiz };