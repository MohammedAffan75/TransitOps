import { Router } from 'express';
import authRoutes from './auth.routes.js';

const router = Router();

// Mount authentication routes under /auth
router.use('/auth', authRoutes);

export default router;
