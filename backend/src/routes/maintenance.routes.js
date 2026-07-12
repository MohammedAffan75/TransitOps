import { Router } from 'express';
import { sendVehicleToShop, completeMaintenance } from '../controllers/maintenance.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Apply global auth to all maintenance routes
router.use(requireAuth);

// Route to send a vehicle to maintenance (shop)
router.post('/', requireRole(['FLEET_MANAGER']), sendVehicleToShop);

// Route to complete active maintenance
router.post('/:id/complete', requireRole(['FLEET_MANAGER']), completeMaintenance);

export default router;
