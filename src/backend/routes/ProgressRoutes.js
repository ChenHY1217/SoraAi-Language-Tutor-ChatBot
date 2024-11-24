import express from 'express';

// Importing controllers
import { getProgress, updateProgress } from '../controllers/ProgressController.js';

// Importing middlewares
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:lang', authenticate, getProgress);
router.put('/:lang', authenticate, updateProgress);

export default router;