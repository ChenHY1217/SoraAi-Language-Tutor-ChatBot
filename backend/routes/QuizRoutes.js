import express from 'express';

// Importing controllers
import { createQuiz, answerQuiz, getQuizzes } from '../controllers/QuizController.js';

// Importing middlewares
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:lang', authenticate, authorizeAdmin, getQuizzes);

router.post('/create', authenticate, createQuiz);
router.patch('/:quizId/answer', authenticate, answerQuiz);


export default router;