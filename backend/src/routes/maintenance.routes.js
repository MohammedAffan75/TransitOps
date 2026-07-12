import { Router } from 'express';
import { sendVehicleToShop, completeMaintenance } from '../controllers/maintenance.controller.js';

const router = Router();

// Route to send a vehicle to maintenance (shop)
router.post('/', sendVehicleToShop);

// Route to complete active maintenance
router.post('/:id/complete', completeMaintenance);

export default router;
