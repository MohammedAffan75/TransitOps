import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import * as maintenanceService from '../services/maintenance.service.js';
import prisma from '../config/prisma.js';

/**
 * GET /api/maintenance
 * List all maintenance records with vehicle info
 */
export const getMaintenanceRecords = asyncHandler(async (req, res) => {
  const records = await prisma.maintenanceRecord.findMany({
    include: {
      vehicle: { select: { id: true, model: true, registrationNumber: true } },
    },
    orderBy: { date: 'desc' },
  });
  res.status(200).json(new ApiResponse(200, records, 'Maintenance records fetched.'));
});

/**
 * GET /api/maintenance/:id
 */
export const getMaintenanceById = asyncHandler(async (req, res) => {
  const record = await prisma.maintenanceRecord.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      vehicle: { select: { id: true, model: true, registrationNumber: true } },
    },
  });
  if (!record) throw new ApiError(404, 'Maintenance record not found.');
  res.status(200).json(new ApiResponse(200, record, 'Maintenance record fetched.'));
});

/**
 * POST /api/maintenance
 * Sends a vehicle to the maintenance shop.
 */
export const sendVehicleToShop = asyncHandler(async (req, res) => {
  const record = await maintenanceService.sendVehicleToShop(req.body);
  res.status(201).json(new ApiResponse(201, record, 'Vehicle successfully sent to shop.'));
});

/**
 * POST /api/maintenance/:id/complete
 * Marks maintenance complete and returns vehicle to dispatch pool.
 */
export const completeMaintenance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const record = await maintenanceService.completeMaintenance(id);
  res.status(200).json(new ApiResponse(200, record, 'Maintenance completed successfully. Vehicle returned to dispatchable pool.'));
});
