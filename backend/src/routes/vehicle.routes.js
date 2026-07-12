import express from 'express';
import { createVehicle, getVehicles, getDispatchableVehicles, updateVehicleStatus } from '../controllers/vehicle.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply global auth to all vehicle routes
router.use(requireAuth);

// Specific routes
router.get('/dispatchable', requireRole(['FLEET_MANAGER', 'DISPATCHER']), getDispatchableVehicles);

// Generic routes
router.route('/')
  .post(requireRole(['FLEET_MANAGER']), createVehicle)
  .get(getVehicles); // all authenticated users can view vehicles

// Status update route
router.patch('/:id/status', requireRole(['FLEET_MANAGER']), updateVehicleStatus);

export default router;
