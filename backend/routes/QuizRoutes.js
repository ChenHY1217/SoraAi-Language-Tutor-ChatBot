import express from 'express';

// Importing controllers
import { createQuiz } from '../controllers/QuizController.js';

// Importing middlewares
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create', authenticate, createQuiz);


export default router;