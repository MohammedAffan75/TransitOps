import { Router } from 'express';
import { addFuelLog, addOtherExpense, getVehicleExpenses, getAllFuelLogs, getAllExpenses } from '../controllers/expense.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);

// List all fuel logs
router.get('/fuel', requireRole(['FLEET_MANAGER', 'FINANCIAL_ANALYST', 'DISPATCHER']), getAllFuelLogs);

// List all other expenses
router.get('/other', requireRole(['FLEET_MANAGER', 'FINANCIAL_ANALYST']), getAllExpenses);

// Get expenses for a specific vehicle
router.get('/vehicle/:id', requireRole(['FLEET_MANAGER', 'FINANCIAL_ANALYST']), getVehicleExpenses);

// Add fuel log or other expense
router.post('/fuel', requireRole(['DISPATCHER', 'FLEET_MANAGER', 'FINANCIAL_ANALYST']), addFuelLog);
router.post('/other', requireRole(['FLEET_MANAGER', 'FINANCIAL_ANALYST']), addOtherExpense);

export default router;
