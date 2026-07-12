import prisma from '../config/prisma.js';
import ApiError from '../utils/ApiError.js';

export const addFuelLog = async (data) => {
  const { liters, cost, vehicleId, tripId, date } = data;

  if (!liters || !cost || !vehicleId) {
    throw new ApiError(400, 'Liters, cost, and vehicleId are required for fuel logs.');
  }

  // Verify vehicle exists
  const vehicle = await prisma.vehicle.findUnique({ where: { id: Number(vehicleId) } });
  if (!vehicle) {
    throw new ApiError(404, `Vehicle with ID ${vehicleId} not found.`);
  }

  // If tripId provided, verify it exists
  if (tripId) {
    const trip = await prisma.trip.findUnique({ where: { id: Number(tripId) } });
    if (!trip) {
      throw new ApiError(404, `Trip with ID ${tripId} not found.`);
    }
    if (trip.vehicleId !== Number(vehicleId)) {
      throw new ApiError(400, `Trip ${tripId} does not belong to vehicle ${vehicleId}.`);
    }
  }

  return await prisma.fuelLog.create({
    data: {
      liters,
      cost,
      date: date ? new Date(date) : new Date(),
      vehicleId: Number(vehicleId),
      tripId: tripId ? Number(tripId) : null
    }
  });
};

export const addOtherExpense = async (data) => {
  const { type, amount, vehicleId, tripId, date } = data;

  if (!type || !amount || !vehicleId) {
    throw new ApiError(400, 'Type, amount, and vehicleId are required for expenses.');
  }

  if (!['TOLL', 'MAINTENANCE', 'OTHER'].includes(type)) {
    throw new ApiError(400, 'Invalid expense type. Must be TOLL, MAINTENANCE, or OTHER.');
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: Number(vehicleId) } });
  if (!vehicle) {
    throw new ApiError(404, `Vehicle with ID ${vehicleId} not found.`);
  }

  if (tripId) {
    const trip = await prisma.trip.findUnique({ where: { id: Number(tripId) } });
    if (!trip) {
      throw new ApiError(404, `Trip with ID ${tripId} not found.`);
    }
    if (trip.vehicleId !== Number(vehicleId)) {
      throw new ApiError(400, `Trip ${tripId} does not belong to vehicle ${vehicleId}.`);
    }
  }

  return await prisma.expense.create({
    data: {
      type,
      amount,
      date: date ? new Date(date) : new Date(),
      vehicleId: Number(vehicleId),
      tripId: tripId ? Number(tripId) : null
    }
  });
};

export const getVehicleExpenses = async (vehicleId) => {
  const id = Number(vehicleId);

  const fuelLogs = await prisma.fuelLog.findMany({
    where: { vehicleId: id },
    orderBy: { date: 'desc' }
  });

  const otherExpenses = await prisma.expense.findMany({
    where: { vehicleId: id },
    orderBy: { date: 'desc' }
  });

  return { fuelLogs, otherExpenses };
};
