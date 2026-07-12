import { Router } from 'express';
import { createDraftTrip, dispatchTrip, completeTrip } from '../controllers/trip.controller.js';

const router = Router();

// Route to create a new draft trip
router.post('/', createDraftTrip);

// Route to dispatch a draft trip
router.post('/:id/dispatch', dispatchTrip);

// Route to complete a dispatched trip
router.post('/:id/complete', completeTrip);

export default router;
