import { Router } from 'express';
import { addFuelLog, addOtherExpense, getVehicleExpenses } from '../controllers/expense.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Apply global auth to all expense routes
router.use(requireAuth);

// Route to add a fuel log
router.post('/fuel', requireRole(['DRIVER', 'DISPATCHER', 'FLEET_MANAGER', 'FINANCIAL_ANALYST']), addFuelLog);

// Route to add another type of expense (TOLL, MAINTENANCE, OTHER)
router.post('/other', requireRole(['DRIVER', 'DISPATCHER', 'FLEET_MANAGER', 'FINANCIAL_ANALYST']), addOtherExpense);

// Route to get all expenses for a specific vehicle
router.get('/vehicle/:id', requireRole(['FLEET_MANAGER', 'FINANCIAL_ANALYST']), getVehicleExpenses);

export default router;
