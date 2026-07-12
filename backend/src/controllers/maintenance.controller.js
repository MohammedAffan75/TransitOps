import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as maintenanceService from '../services/maintenance.service.js';

/**
 * Handle POST /api/maintenance
 * Sends a vehicle to the maintenance shop.
 */
export const sendVehicleToShop = asyncHandler(async (req, res) => {
  const record = await maintenanceService.sendVehicleToShop(req.body);
  res.status(201).json(new ApiResponse(201, record, 'Vehicle successfully sent to shop.'));
});

/**
 * Handle POST /api/maintenance/:id/complete
 * Marks maintenance complete and returns vehicle to dispatch pool.
 */
export const completeMaintenance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const record = await maintenanceService.completeMaintenance(id);
  res.status(200).json(new ApiResponse(200, record, 'Maintenance completed successfully. Vehicle returned to dispatchable pool.'));
});
