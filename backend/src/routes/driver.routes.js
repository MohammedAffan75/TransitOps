import express from 'express';
import { createDriver, getDrivers, getDispatchableDrivers, updateDriverStatus } from '../controllers/driver.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply global auth to all driver routes
router.use(requireAuth);

router.get('/dispatchable', requireRole(['FLEET_MANAGER', 'DISPATCHER']), getDispatchableDrivers);

router.route('/')
  .post(requireRole(['SAFETY_OFFICER', 'FLEET_MANAGER']), createDriver)
  .get(getDrivers); // all authenticated users can view drivers

router.patch('/:id/status', requireRole(['SAFETY_OFFICER', 'FLEET_MANAGER']), updateDriverStatus);

export default router;
