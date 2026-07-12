import express from 'express';
import { createVehicle, getVehicles, getDispatchableVehicles, updateVehicleStatus } from '../controllers/vehicle.controller.js';

const router = express.Router();

// Specific routes
router.get('/dispatchable', getDispatchableVehicles);

// Generic routes
router.route('/')
  .post(createVehicle)
  .get(getVehicles);

// Status update route
router.patch('/:id/status', updateVehicleStatus);

export default router;
