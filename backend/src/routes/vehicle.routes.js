import express from 'express';
import { createVehicle, getVehicles, getDispatchableVehicles } from '../controllers/vehicle.controller.js';

const router = express.Router();

// Specific routes
router.get('/dispatchable', getDispatchableVehicles);

// Generic routes
router.route('/')
  .post(createVehicle)
  .get(getVehicles);

export default router;
