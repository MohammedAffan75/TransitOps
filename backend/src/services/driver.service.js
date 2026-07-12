import prisma from '../config/prisma.js';
import ApiError from '../utils/ApiError.js';

export const createDriver = async (data) => {
  const { name, licenseNo, category, expiry, phone } = data;

  // check if all needed data is provided
  if (!name || !licenseNo || !category || !expiry || !phone) {
    throw new ApiError(400, 'Please provide all required driver fields (name, licenseNo, category, expiry, phone)');
  }

  // check if a driver with this license number already exists
  const existingDriver = await prisma.driver.findUnique({
    where: { licenseNumber: licenseNo }
  });

  if (existingDriver) {
    throw new ApiError(400, `Driver with license ${licenseNo} already exists.`);
  }

  // create the driver with some default starting values
  const driver = await prisma.driver.create({
    data: {
      name,
      licenseNumber: licenseNo,
      licenseCategory: category,
      licenseExpiry: new Date(expiry),
      contactNumber: phone,
      status: 'AVAILABLE',
      safetyScore: 100, // new drivers start with a perfect score
      totalTrips: 0,
      completedTrips: 0,
    }
  });

  return mapDriver(driver);
};

export const getDrivers = async (filters) => {
  const { status, licenseStatus } = filters;

  const where = {};
  if (status) where.status = status;
  if (licenseStatus === 'Valid') {
    where.licenseExpiry = { gt: new Date() };
  } else if (licenseStatus === 'Expired') {
    where.licenseExpiry = { lte: new Date() };
  }

  const drivers = await prisma.driver.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });

  return drivers.map(mapDriver);
};

export const getDispatchableDrivers = async () => {
  // only get drivers that are available and whose license hasn't expired
  const drivers = await prisma.driver.findMany({
    where: { 
      status: 'AVAILABLE',
      licenseExpiry: {
        gt: new Date() // expiry date must be in the future
      }
    },
    orderBy: { name: 'asc' }
  });

  return drivers.map(mapDriver);
};

// helper function to format the driver data for the frontend
const mapDriver = (d) => {
  let completion = 100;
  if (d.totalTrips > 0) {
    completion = Math.round((d.completedTrips / d.totalTrips) * 100);
  }
  
  return {
    ...d,
    licenseNo: d.licenseNumber,
    category: d.licenseCategory,
    expiry: d.licenseExpiry,
    phone: d.contactNumber,
    licenseStatus: (d.status === 'SUSPENDED' || new Date(d.licenseExpiry) < new Date()) ? 'Expired' : 'Valid',
    tripCompletion: completion
  };
};

export const updateDriverStatus = async (driverId, newStatus) => {
  const id = Number(driverId);
  const validStatuses = ['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED'];

  if (!validStatuses.includes(newStatus)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const driver = await prisma.driver.findUnique({ where: { id } });
  if (!driver) {
    throw new ApiError(404, `Driver with ID ${id} not found.`);
  }

  if (driver.status === 'ON_TRIP' && newStatus !== 'ON_TRIP') {
    throw new ApiError(400, 'Cannot change status of a driver that is currently ON_TRIP. Complete or cancel the trip first.');
  }

  const updatedDriver = await prisma.driver.update({
    where: { id },
    data: { status: newStatus }
  });

  return mapDriver(updatedDriver);
};
