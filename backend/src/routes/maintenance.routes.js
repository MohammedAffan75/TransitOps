import { Router } from 'express';
import { sendVehicleToShop, completeMaintenance, getMaintenanceRecords, getMaintenanceById } from '../controllers/maintenance.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);

// List all maintenance records (all roles can view)
router.get('/', getMaintenanceRecords);
router.get('/:id', getMaintenanceById);

// Fleet Manager actions
router.post('/', requireRole(['FLEET_MANAGER']), sendVehicleToShop);
router.post('/:id/complete', requireRole(['FLEET_MANAGER']), completeMaintenance);

export default router;
