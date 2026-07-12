import { Router } from 'express';
import { getKPIs, exportCSV } from '../controllers/dashboard.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// All dashboard routes require a valid login
router.use(requireAuth);

// All logged-in roles can view the summary KPIs
router.get('/kpis', getKPIs);

// All logged-in roles can export data
router.get('/export', exportCSV);

export default router;
