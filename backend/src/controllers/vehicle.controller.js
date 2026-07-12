import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as VehicleService from '../services/vehicle.service.js';

// @desc    Register a new vehicle
// @route   POST /api/vehicles
// @access  Private
export const createVehicle = asyncHandler(async (req, res) => {
  const vehicle = await VehicleService.createVehicle(req.body);
  res.status(201).json(new ApiResponse(201, vehicle, 'Vehicle registered successfully'));
});

// @desc    Get all vehicles (with optional filters)
// @route   GET /api/vehicles
// @access  Private
export const getVehicles = asyncHandler(async (req, res) => {
  const vehicles = await VehicleService.getVehicles(req.query);
  res.status(200).json(new ApiResponse(200, vehicles, 'Vehicles retrieved successfully'));
});

// @desc    Get only dispatchable vehicles
// @route   GET /api/vehicles/dispatchable
// @access  Private
export const getDispatchableVehicles = asyncHandler(async (req, res) => {
  const vehicles = await VehicleService.getDispatchableVehicles();
  res.status(200).json(new ApiResponse(200, vehicles, 'Dispatchable vehicles retrieved successfully'));
});

// @desc    Update vehicle status
// @route   PATCH /api/vehicles/:id/status
// @access  Private
export const updateVehicleStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json(new ApiResponse(400, null, 'Status field is required'));
  }
  
  const vehicle = await VehicleService.updateVehicleStatus(id, status.toUpperCase());
  res.status(200).json(new ApiResponse(200, vehicle, `Vehicle status updated to ${vehicle.status}`));
});
