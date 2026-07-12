import prisma from '../config/prisma.js';

/**
 * Retrieves aggregated KPIs for the Fleet Manager dashboard.
 * @returns {Promise<object>} Dashboard metrics object
 */
export async function getDashboardKPIs() {
  // 1. Vehicles
  const totalVehicles = await prisma.vehicle.count();
  const activeVehicles = await prisma.vehicle.count({ 
    where: { status: { in: ['AVAILABLE', 'ON_TRIP'] } } 
  });
  const availableVehicles = await prisma.vehicle.count({ 
    where: { status: 'AVAILABLE' } 
  });
  const vehiclesInShop = await prisma.vehicle.count({ 
    where: { status: 'IN_SHOP' } 
  });

  // Fleet Utilization = (Active Vehicles / Total Vehicles) * 100
  const fleetUtilization = totalVehicles > 0 ? ((activeVehicles / totalVehicles) * 100).toFixed(2) : 0;

  // 2. Trips & Drivers
  const activeTrips = await prisma.trip.count({ where: { status: 'DISPATCHED' } });
  const pendingTrips = await prisma.trip.count({ where: { status: 'DRAFT' } });
  const driversOnDuty = await prisma.driver.count({ where: { status: 'ON_TRIP' } });

  // 3. Costs, Revenue & Distance
  // Summing revenue and distance from completed trips
  const revenueAgg = await prisma.trip.aggregate({ 
    _sum: { revenue: true, distance: true }, 
    where: { status: 'COMPLETED' } 
  });
  const totalRevenue = Number(revenueAgg._sum.revenue || 0);
  const totalDistance = Number(revenueAgg._sum.distance || 0);

  // Summing Maintenance Cost
  const maintenanceAgg = await prisma.maintenanceRecord.aggregate({ 
    _sum: { cost: true } 
  });
  const totalMaintenance = Number(maintenanceAgg._sum.cost || 0);

  // Summing Fuel Cost and Liters
  const fuelAgg = await prisma.fuelLog.aggregate({ 
    _sum: { cost: true, liters: true } 
  });
  const totalFuelCost = Number(fuelAgg._sum.cost || 0);
  const totalFuelLiters = Number(fuelAgg._sum.liters || 0);

  // Operational Cost (Fuel + Maintenance)
  const operationalCost = totalMaintenance + totalFuelCost;

  // Fuel Efficiency (Distance / Fuel)
  const fuelEfficiency = totalFuelLiters > 0 ? (totalDistance / totalFuelLiters).toFixed(2) : 0;

  // 4. Vehicle ROI
  const acqAgg = await prisma.vehicle.aggregate({ 
    _sum: { acquisitionCost: true } 
  });
  const totalAcquisitionCost = Number(acqAgg._sum.acquisitionCost || 0);
  
  // Vehicle ROI ((Revenue - Operational Cost) / Acquisition Cost)
  const vehicleROI = totalAcquisitionCost > 0 ? (((totalRevenue - operationalCost) / totalAcquisitionCost) * 100).toFixed(2) : 0;

  // Extra fields the frontend expects
  const completedTrips   = await prisma.trip.count({ where: { status: 'COMPLETED' } });
  const availableDrivers = await prisma.driver.count({ where: { status: 'AVAILABLE' } });
  const expensesAgg = await prisma.expense.aggregate({ _sum: { amount: true } });
  const otherExpenses = Number(expensesAgg._sum.amount || 0);
  const totalExpenses = operationalCost + otherExpenses;

  // 5. Generate Monthly Revenue for charts (Mocking trailing 6 months dynamically based on real total, or just static structure if no real timeline data)
  // For simplicity, we'll create a 6 month array and put all total revenue in current month if we don't have historical trips.
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const monthlyRevenue = [];
  for (let i = 5; i >= 0; i--) {
    let m = currentMonth - i;
    if (m < 0) m += 12;
    monthlyRevenue.push({ month: months[m], revenue: i === 0 ? totalRevenue : 0 });
  }

  // 6. Costliest Vehicles
  // Fetch vehicles ordered by acquisitionCost as a proxy, or calculate real maintenance/fuel.
  const topVehicles = await prisma.vehicle.findMany({
    orderBy: { acquisitionCost: 'desc' },
    take: 3,
    select: { model: true, registrationNumber: true, acquisitionCost: true }
  });
  const maxCost = topVehicles.length > 0 ? Number(topVehicles[0].acquisitionCost) : 10000;
  const costliestVehicles = topVehicles.map(v => ({
    name: `${v.model} (${v.registrationNumber})`,
    cost: Number(v.acquisitionCost),
    max: maxCost
  }));

  return {
    // Aliased for frontend compatibility
    totalActiveVehicles: activeVehicles,
    ongoingTrips: activeTrips,
    vehiclesInMaintenance: vehiclesInShop,
    completedTrips,
    availableDrivers,
    totalExpenses,

    // Original fields
    activeVehicles,
    availableVehicles,
    vehiclesInShop,
    activeTrips,
    pendingTrips,
    driversOnDuty,
    fleetUtilization: Number(fleetUtilization),
    totalRevenue,
    operationalCost,
    fuelEfficiency: Number(fuelEfficiency),
    vehicleROI: Number(vehicleROI),
    
    // New Chart Data
    monthlyRevenue,
    costliestVehicles
  };
}

/**
 * Generates a comprehensive CSV string containing metrics for all roles.
 * @returns {Promise<string>} CSV formatted string
 */
export async function exportKPIsToCSV() {
  const kpis = await getDashboardKPIs();
  
  const header = 'Category,Metric,Value\n';
  const rows = [
    `Fleet,Total Active Vehicles,${kpis.totalActiveVehicles}`,
    `Fleet,Available Vehicles,${kpis.availableVehicles}`,
    `Fleet,Vehicles In Shop,${kpis.vehiclesInShop}`,
    `Fleet,Fleet Utilization (%),${kpis.fleetUtilization}`,
    `Driver,Drivers On Duty,${kpis.driversOnDuty}`,
    `Driver,Available Drivers,${kpis.availableDrivers}`,
    `Trip,Pending Trips,${kpis.pendingTrips}`,
    `Trip,Active Trips,${kpis.activeTrips}`,
    `Trip,Completed Trips,${kpis.completedTrips}`,
    `Finance,Total Revenue (₹),${kpis.totalRevenue}`,
    `Finance,Operational Cost (₹),${kpis.operationalCost}`,
    `Finance,Total Expenses (₹),${kpis.totalExpenses}`,
    `Finance,Fuel Efficiency (km/L),${kpis.fuelEfficiency}`,
    `Finance,Vehicle ROI (%),${kpis.vehicleROI}`
  ].join('\n');

  return header + rows;
}
