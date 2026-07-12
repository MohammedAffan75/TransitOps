import express from 'express';
import { createDriver, getDrivers, getDispatchableDrivers, updateDriverStatus } from '../controllers/driver.controller.js';

const router = express.Router();

router.get('/dispatchable', getDispatchableDrivers);

router.route('/')
  .post(createDriver)
  .get(getDrivers);

router.patch('/:id/status', updateDriverStatus);

export default router;
