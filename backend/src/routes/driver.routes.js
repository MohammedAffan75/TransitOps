import express from 'express';
import { createDriver, getDrivers, getDispatchableDrivers } from '../controllers/driver.controller.js';

const router = express.Router();

router.get('/dispatchable', getDispatchableDrivers);

router.route('/')
  .post(createDriver)
  .get(getDrivers);

export default router;
