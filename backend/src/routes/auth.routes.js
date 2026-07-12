import { Router } from 'express';
import { register, login, getMe, logout } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', login);

// Route to get current user
router.get('/me', requireAuth, getMe);

// Route for user logout
router.post('/logout', requireAuth, logout);

export default router;
