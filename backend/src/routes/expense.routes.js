import { Router } from 'express';
import { addFuelLog, addOtherExpense, getVehicleExpenses } from '../controllers/expense.controller.js';

const router = Router();

// Route to add a fuel log
router.post('/fuel', addFuelLog);

// Route to add another type of expense (TOLL, MAINTENANCE, OTHER)
router.post('/other', addOtherExpense);

// Route to get all expenses for a specific vehicle
router.get('/vehicle/:id', getVehicleExpenses);

export default router;
