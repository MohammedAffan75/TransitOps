import { Router } from 'express';
import { createDraftTrip, dispatchTrip, completeTrip, cancelTrip, getTrips, getTripById } from '../controllers/trip.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);

// List all trips (all roles)
router.get('/', getTrips);

// Get single trip
router.get('/:id', getTripById);

// Dispatcher / Fleet Manager actions
router.post('/', requireRole(['DISPATCHER', 'FLEET_MANAGER']), createDraftTrip);
router.post('/:id/dispatch', requireRole(['DISPATCHER', 'FLEET_MANAGER']), dispatchTrip);
router.post('/:id/complete', requireRole(['DISPATCHER', 'FLEET_MANAGER']), completeTrip);
router.post('/:id/cancel', requireRole(['DISPATCHER', 'FLEET_MANAGER']), cancelTrip);

export default router;
