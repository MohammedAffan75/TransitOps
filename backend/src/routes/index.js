import { Router } from 'express';
import vehicleRoutes from './vehicle.routes.js';
import driverRoutes from './driver.routes.js';
import authRoutes from './auth.routes.js';
import tripRoutes from './trip.routes.js';
import maintenanceRoutes from './maintenance.routes.js';
// expense and dashboard will be added when implemented

const router = Router();

router.use('/vehicles', vehicleRoutes);
router.use('/drivers', driverRoutes);
router.use('/auth', authRoutes);
router.use('/trips', tripRoutes);
router.use('/maintenance', maintenanceRoutes);

export default router;
