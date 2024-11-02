import express from 'express';

// Importing controllers
import {
    registerUser,
    loginUser,
    logoutUser,
    getAllUsers,
    getCurrentUserProfile,
    updateCurrentUserProfile
} from '../controllers/UserControllers.js';

// Importing middlewares
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, authorizeAdmin, getAllUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.route('/profile')
    .get(authenticate, getCurrentUserProfile)
    .put(authenticate, updateCurrentUserProfile);

export default router;