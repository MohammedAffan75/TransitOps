import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as DriverService from '../services/driver.service.js';

// @desc    Register a new driver
// @route   POST /api/drivers
// @access  Private
export const createDriver = asyncHandler(async (req, res) => {
  const driver = await DriverService.createDriver(req.body);
  res.status(201).json(new ApiResponse(201, driver, 'Driver registered successfully'));
});

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Private
export const getDrivers = asyncHandler(async (req, res) => {
  const drivers = await DriverService.getDrivers(req.query);
  res.status(200).json(new ApiResponse(200, drivers, 'Drivers retrieved successfully'));
});

// @desc    Get only dispatchable drivers
// @route   GET /api/drivers/dispatchable
// @access  Private
export const getDispatchableDrivers = asyncHandler(async (req, res) => {
  const drivers = await DriverService.getDispatchableDrivers();
  res.status(200).json(new ApiResponse(200, drivers, 'Dispatchable drivers retrieved successfully'));
});

// @desc    Update driver status
// @route   PATCH /api/drivers/:id/status
// @access  Private
export const updateDriverStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json(new ApiResponse(400, null, 'Status field is required'));
  }
  
  const driver = await DriverService.updateDriverStatus(id, status.toUpperCase());
  res.status(200).json(new ApiResponse(200, driver, `Driver status updated to ${driver.status}`));
});
