import prisma from '../config/prisma.js';
import ApiError from '../utils/ApiError.js';

export const createVehicle = async (data) => {
  const { registration, name, type, capacityKg, odometer, acquisitionCost, region } = data;

  // check if all needed data is provided
  if (!registration || !name || !type || !capacityKg) {
    throw new ApiError(400, 'Please provide all required vehicle fields (registration, name, type, capacityKg)');
  }

  // check if vehicle with this registration is already in the database
  const existingVehicle = await prisma.vehicle.findUnique({
    where: { registrationNumber: registration }
  });

  if (existingVehicle) {
    throw new ApiError(400, `Vehicle with registration ${registration} already exists.`);
  }

  // create the new vehicle with some default values
  const vehicle = await prisma.vehicle.create({
    data: {
      registrationNumber: registration,
      model: name,
      type,
      capacity: capacityKg,
      odometer: odometer || 0,
      acquisitionCost: acquisitionCost || 0,
      status: 'AVAILABLE',
      region: region || 'Unassigned',
    }
  });

  return mapVehicle(vehicle);
};

export const getVehicles = async (filters) => {
  const { status, type, region } = filters;

  const where = {};
  if (status) where.status = status;
  if (type) where.type = type;
  if (region) where.region = region;

  const vehicles = await prisma.vehicle.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });

  return vehicles.map(mapVehicle);
};

export const getDispatchableVehicles = async () => {
  const vehicles = await prisma.vehicle.findMany({
    where: { status: 'AVAILABLE' },
    orderBy: { model: 'asc' }
  });

  return vehicles.map(mapVehicle);
};

// Helper function to format vehicle data for the frontend
const mapVehicle = (vehicle) => {
  return {
    ...vehicle,
    name: vehicle.model,
    registration: vehicle.registrationNumber,
    capacityKg: Number(vehicle.capacity),
    capacity: `${vehicle.capacity} kg`,
    fuelType: 'Diesel', // static fallback for frontend
    year: new Date().getFullYear(),
  };
};

export const updateVehicleStatus = async (vehicleId, newStatus) => {
  const id = Number(vehicleId);
  const validStatuses = ['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED'];

  if (!validStatuses.includes(newStatus)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) {
    throw new ApiError(404, `Vehicle with ID ${id} not found.`);
  }

  if (vehicle.status === 'ON_TRIP' && newStatus !== 'ON_TRIP') {
    throw new ApiError(400, 'Cannot change status of a vehicle that is currently ON_TRIP. Complete or cancel the trip first.');
  }

  const updatedVehicle = await prisma.vehicle.update({
    where: { id },
    data: { status: newStatus }
  });

  return mapVehicle(updatedVehicle);
};
