import { Router } from 'express';
import vehicleRoutes from './vehicle.routes.js';
import driverRoutes from './driver.routes.js';
import authRoutes from './auth.routes.js';
import tripRoutes from './trip.routes.js';
import maintenanceRoutes from './maintenance.routes.js';
import expenseRoutes from './expense.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

router.use('/vehicles', vehicleRoutes);
router.use('/drivers', driverRoutes);
router.use('/auth', authRoutes);
router.use('/trips', tripRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/expenses', expenseRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;


