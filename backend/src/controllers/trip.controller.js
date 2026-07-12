import * as tripService from '../services/trip.service.js';

/**
 * Handle POST /api/trips
 * Creates a DRAFT trip.
 */
export async function createDraftTrip(req, res) {
  try {
    const trip = await tripService.createDraftTrip(req.body);
    return res.status(201).json({
      message: 'Draft trip created successfully.',
      trip
    });
  } catch (error) {
    console.error('Error in createDraftTrip controller:', error);
    return res.status(400).json({ error: error.message });
  }
}

/**
 * Handle POST /api/trips/:id/dispatch
 * Atomically validates requirements and dispatches a trip.
 */
export async function dispatchTrip(req, res) {
  try {
    const { id } = req.params;
    const trip = await tripService.dispatchTrip(id);
    return res.status(200).json({
      message: 'Trip dispatched successfully. Vehicle and driver are now locked.',
      trip
    });
  } catch (error) {
    console.error('Error in dispatchTrip controller:', error);
    return res.status(400).json({ error: error.message });
  }
}

/**
 * Handle POST /api/trips/:id/complete
 * Atomically completes a trip and releases resources.
 */
export async function completeTrip(req, res) {
  try {
    const { id } = req.params;
    const trip = await tripService.completeTrip(id);
    return res.status(200).json({
      message: 'Trip completed successfully. Vehicle and driver are now unlocked.',
      trip
    });
  } catch (error) {
    console.error('Error in completeTrip controller:', error);
    return res.status(400).json({ error: error.message });
  }
}
