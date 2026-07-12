import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as tripService from '../services/trip.service.js';

/**
 * Handle POST /api/trips
 * Creates a DRAFT trip.
 */
export const createDraftTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.createDraftTrip(req.body);
  res.status(201).json(new ApiResponse(201, trip, 'Draft trip created successfully.'));
});

/**
 * Handle POST /api/trips/:id/dispatch
 * Atomically validates requirements and dispatches a trip.
 */
export const dispatchTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const trip = await tripService.dispatchTrip(id);
  res.status(200).json(new ApiResponse(200, trip, 'Trip dispatched successfully. Vehicle and driver are now locked.'));
});

/**
 * Handle POST /api/trips/:id/complete
 * Atomically completes a trip and releases resources.
 */
export const completeTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const trip = await tripService.completeTrip(id);
  res.status(200).json(new ApiResponse(200, trip, 'Trip completed successfully. Vehicle and driver are now unlocked.'));
});

/**
 * Handle POST /api/trips/:id/cancel
 * Atomically cancels a trip and releases resources.
 */
export const cancelTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const trip = await tripService.cancelTrip(id);
  res.status(200).json(new ApiResponse(200, trip, 'Trip cancelled successfully. Vehicle and driver are available again.'));
});
