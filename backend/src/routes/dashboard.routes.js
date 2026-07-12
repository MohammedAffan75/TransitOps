import { Router } from 'express';
import { getKPIs } from '../controllers/dashboard.controller.js';

const router = Router();

// Route to get aggregated dashboard KPIs
router.get('/kpis', getKPIs);

export default router;
