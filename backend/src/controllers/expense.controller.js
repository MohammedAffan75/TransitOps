import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as expenseService from '../services/expense.service.js';

/**
 * Handle POST /api/expenses/fuel
 */
export const addFuelLog = asyncHandler(async (req, res) => {
  const fuelLog = await expenseService.addFuelLog(req.body);
  res.status(201).json(new ApiResponse(201, fuelLog, 'Fuel log added successfully.'));
});

/**
 * Handle POST /api/expenses/other
 */
export const addOtherExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.addOtherExpense(req.body);
  res.status(201).json(new ApiResponse(201, expense, 'Expense added successfully.'));
});

/**
 * Handle GET /api/expenses/vehicle/:id
 */
export const getVehicleExpenses = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const expenses = await expenseService.getVehicleExpenses(id);
  res.status(200).json(new ApiResponse(200, expenses, 'Vehicle expenses retrieved successfully.'));
});
