import { Router } from 'express';
import { getKPIs, exportCSV } from '../controllers/dashboard.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Apply global auth to all dashboard routes
router.use(requireAuth);

// Route to get aggregated dashboard KPIs
router.get('/kpis', requireRole(['FLEET_MANAGER', 'FINANCIAL_ANALYST']), getKPIs);

// Route to export KPIs to CSV
router.get('/export', requireRole(['FLEET_MANAGER', 'FINANCIAL_ANALYST']), exportCSV);

export default router;
