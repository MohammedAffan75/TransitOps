import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as dashboardService from '../services/dashboard.service.js';

// @desc    Get aggregated KPI metrics for dashboard view
// @route   GET /api/dashboard/kpis
// @access  Private
export const getKPIs = asyncHandler(async (req, res) => {
  const kpis = await dashboardService.getDashboardKPIs();
  res.status(200).json(new ApiResponse(200, kpis, 'Dashboard KPIs retrieved successfully'));
});

// @desc    Export KPIs to CSV
// @route   GET /api/dashboard/export
// @access  Private
export const exportCSV = asyncHandler(async (req, res) => {
  const csvData = await dashboardService.exportKPIsToCSV();
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="transitops_kpis.csv"');
  
  return res.status(200).send(csvData);
});
