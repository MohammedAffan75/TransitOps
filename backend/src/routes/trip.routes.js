import { Router } from 'express';
import { createDraftTrip, dispatchTrip, completeTrip, cancelTrip } from '../controllers/trip.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Apply global auth to all trip routes
router.use(requireAuth);

// Route to create a new draft trip
router.post('/', requireRole(['DISPATCHER', 'FLEET_MANAGER']), createDraftTrip);

// Route to dispatch a draft trip
router.post('/:id/dispatch', requireRole(['DISPATCHER', 'FLEET_MANAGER']), dispatchTrip);

// Route to complete a dispatched trip
router.post('/:id/complete', requireRole(['DISPATCHER', 'FLEET_MANAGER']), completeTrip);

// Route to cancel a trip
router.post('/:id/cancel', requireRole(['DISPATCHER', 'FLEET_MANAGER']), cancelTrip);

export default router;
