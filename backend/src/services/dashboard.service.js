import prisma from '../config/prisma.js';
import ApiError from '../utils/ApiError.js';

/**
 * Retrieves aggregated KPIs for the Fleet Manager dashboard.
 * @returns {Promise<object>} Dashboard metrics object
 */
export async function getDashboardKPIs() {
  try {
    // 1. Total Active Vehicles (AVAILABLE status)
    const activeVehicles = await prisma.vehicle.count({
      where: {
        status: 'AVAILABLE'
      }
    });

    // 2. Ongoing Trips (DISPATCHED status)
    const ongoingTrips = await prisma.trip.count({
      where: {
        status: 'DISPATCHED'
      }
    });

    // 3. Total Revenue (Sum of revenue for all COMPLETED trips)
    const revenueSum = await prisma.trip.aggregate({
      _sum: {
        revenue: true
      },
      where: {
        status: 'COMPLETED'
      }
    });
    const totalRevenue = Number(revenueSum._sum.revenue || 0);

    // 4. Total Expenses (Sum of all Expense amounts + FuelLog costs)
    const expenseSum = await prisma.expense.aggregate({
      _sum: {
        amount: true
      }
    });
    const totalExpenseAmount = Number(expenseSum._sum.amount || 0);

    const fuelLogSum = await prisma.fuelLog.aggregate({
      _sum: {
        cost: true
      }
    });
    const totalFuelCost = Number(fuelLogSum._sum.cost || 0);

    const totalExpenses = totalExpenseAmount + totalFuelCost;

    return {
      totalActiveVehicles: activeVehicles,
      ongoingTrips,
      totalRevenue,
      totalExpenses
    };
  } catch (error) {
    console.error('Error in getDashboardKPIs service:', error);
    throw new ApiError(500, 'Error compiling dashboard KPI statistics');
  }
}
