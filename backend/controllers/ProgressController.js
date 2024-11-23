import asyncHandler from "../middlewares/asyncHandler.js";

// @desc    Get user progress
// @route   GET /api/progress/:lang
// @access  Private
const getProgress = asyncHandler(async (req, res) => {
    try {
        const language = req.params.lang;
        const user = req.user;

        const targetLanguage = user.targetLanguages.find((targetLang) => targetLang.language === language);

        if (!targetLanguage) {
            return res.status(404).json({ message: "Language not found" });
        }

        res.status(201).json(targetLanguage.learningProgress);

    } catch (error) {
        console.error('Error in getProgress:', error);
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update user progress
// @route   PATCH /api/progress/:lang
// @access  Private
const updateProgress = asyncHandler(async (req, res) => {
    try {
        const language = req.params.lang;
        const { type, score } = req.body;
        const user = req.user;

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

        // Prepare response
        const response = {
            language,
            currentStatus: {
                vocabularyLevel: progress.vocabularyLvl,
                vocabularyProgress: progress.vocabularyProgress,
                grammarLevel: progress.grammarLvl,
                grammarProgress: progress.grammarProgress,
                quizzesCompleted: user.quizHistory.length
            },
            quizPerformance: {
                score,
                totalQuestions: 3,
                progressPointsEarned: progressPoints
            },
            recommendations: {
                vocabulary: progress.vocabularyProgress >= 0.8 ? "Ready for level up soon" : "Keep practicing at current level",
                grammar: progress.grammarProgress >= 0.8 ? "Ready for level up soon" : "Keep practicing at current level"
            }
        };

        res.status(201).json(response);

    } catch (error) {
        console.error('Error in updateProgress:', error);
        res.status(400).json({ message: error.message });
    }
});

export { getProgress, updateProgress };