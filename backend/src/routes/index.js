import { Router } from 'express';
import authRoutes from './auth.routes.js';
import tripRoutes from './trip.routes.js';
import maintenanceRoutes from './maintenance.routes.js';

const router = Router();

// Mount authentication routes under /auth
router.use('/auth', authRoutes);

// Mount trip routes under /trips
router.use('/trips', tripRoutes);

// Mount maintenance routes under /maintenance
router.use('/maintenance', maintenanceRoutes);

export default router;
