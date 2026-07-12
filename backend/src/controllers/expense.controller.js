import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as expenseService from '../services/expense.service.js';
import prisma from '../config/prisma.js';

/**
 * GET /api/expenses/fuel — all fuel logs
 */
export const getAllFuelLogs = asyncHandler(async (req, res) => {
  const logs = await prisma.fuelLog.findMany({
    include: {
      vehicle: { select: { id: true, model: true, registrationNumber: true } },
      trip: { select: { id: true, source: true, destination: true } },
    },
    orderBy: { date: 'desc' },
  });
  res.status(200).json(new ApiResponse(200, logs, 'Fuel logs fetched.'));
});

/**
 * GET /api/expenses/other — all other expenses
 */
export const getAllExpenses = asyncHandler(async (req, res) => {
  const expenses = await prisma.expense.findMany({
    include: {
      vehicle: { select: { id: true, model: true, registrationNumber: true } },
      trip: { select: { id: true, source: true, destination: true } },
    },
    orderBy: { date: 'desc' },
  });
  res.status(200).json(new ApiResponse(200, expenses, 'Expenses fetched.'));
});

/**
 * POST /api/expenses/fuel
 */
export const addFuelLog = asyncHandler(async (req, res) => {
  const fuelLog = await expenseService.addFuelLog(req.body);
  res.status(201).json(new ApiResponse(201, fuelLog, 'Fuel log added successfully.'));
});

/**
 * POST /api/expenses/other
 */
export const addOtherExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.addOtherExpense(req.body);
  res.status(201).json(new ApiResponse(201, expense, 'Expense added successfully.'));
});

/**
 * GET /api/expenses/vehicle/:id
 */
export const getVehicleExpenses = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const expenses = await expenseService.getVehicleExpenses(id);
  res.status(200).json(new ApiResponse(200, expenses, 'Vehicle expenses retrieved successfully.'));
});
