import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import * as tripService from '../services/trip.service.js';
import prisma from '../config/prisma.js';

/**
 * GET /api/trips
 * List all trips with vehicle and driver info
 */
export const getTrips = asyncHandler(async (req, res) => {
  const trips = await prisma.trip.findMany({
    include: {
      vehicle: { select: { id: true, model: true, registrationNumber: true } },
      driver:  { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.status(200).json(new ApiResponse(200, trips, 'Trips fetched successfully.'));
});

/**
 * GET /api/trips/:id
 */
export const getTripById = asyncHandler(async (req, res) => {
  const trip = await prisma.trip.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      vehicle: { select: { id: true, model: true, registrationNumber: true } },
      driver:  { select: { id: true, name: true } },
    },
  });
  if (!trip) throw new ApiError(404, 'Trip not found.');
  res.status(200).json(new ApiResponse(200, trip, 'Trip fetched successfully.'));
});

/**
 * Handle POST /api/trips
 */
export const createDraftTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.createDraftTrip(req.body);
  res.status(201).json(new ApiResponse(201, trip, 'Draft trip created successfully.'));
});

/**
 * Handle POST /api/trips/:id/dispatch
 */
export const dispatchTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const trip = await tripService.dispatchTrip(id);
  res.status(200).json(new ApiResponse(200, trip, 'Trip dispatched successfully. Vehicle and driver are now locked.'));
});

/**
 * Handle POST /api/trips/:id/complete
 */
export const completeTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const trip = await tripService.completeTrip(id);
  res.status(200).json(new ApiResponse(200, trip, 'Trip completed successfully. Vehicle and driver are now unlocked.'));
});

/**
 * Handle POST /api/trips/:id/cancel
 */
export const cancelTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const trip = await tripService.cancelTrip(id);
  res.status(200).json(new ApiResponse(200, trip, 'Trip cancelled successfully. Vehicle and driver are available again.'));
});
