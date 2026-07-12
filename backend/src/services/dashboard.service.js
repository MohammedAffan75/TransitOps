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

  return {
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
    vehicleROI: Number(vehicleROI)
  };
}

/**
 * Generates a CSV string containing the dashboard KPIs.
 * @returns {Promise<string>} CSV formatted string
 */
export async function exportKPIsToCSV() {
  const kpis = await getDashboardKPIs();
  
  const header = 'Metric,Value\n';
  const rows = [
    `Total Active Vehicles,${kpis.activeVehicles}`,
    `Available Vehicles,${kpis.availableVehicles}`,
    `Vehicles In Shop,${kpis.vehiclesInShop}`,
    `Active Trips,${kpis.activeTrips}`,
    `Pending Trips,${kpis.pendingTrips}`,
    `Drivers On Duty,${kpis.driversOnDuty}`,
    `Fleet Utilization (%),${kpis.fleetUtilization}`,
    `Total Revenue ($),${kpis.totalRevenue}`,
    `Operational Cost ($),${kpis.operationalCost}`,
    `Fuel Efficiency (km/L),${kpis.fuelEfficiency}`,
    `Vehicle ROI (%),${kpis.vehicleROI}`
  ].join('\n');

  return header + rows;
}
