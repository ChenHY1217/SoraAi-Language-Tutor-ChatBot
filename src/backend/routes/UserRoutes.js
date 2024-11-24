import express from 'express';

// Importing controllers
import {
    registerUser,
    loginUser,
    logoutUser,
    getAllUsers,
    getCurrentUserProfile,
    updateCurrentUserProfile,
    sendPasswordResetEmail,
    resetPassword
} from '../controllers/UserControllers.js';

// Importing middlewares
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, authorizeAdmin, getAllUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', sendPasswordResetEmail);
router.put('/reset-password/:resetToken', resetPassword);

router.route('/profile')
    .get(authenticate, getCurrentUserProfile)
    .put(authenticate, updateCurrentUserProfile);

export default router;