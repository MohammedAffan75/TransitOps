import prisma from '../config/prisma.js';

/**
 * Creates a trip in DRAFT status. No vehicles or drivers are locked.
 */
export async function createDraftTrip(data) {
  const { source, destination, cargoWeight, distance, revenue, vehicleId, driverId } = data;

  if (!source || !destination || cargoWeight === undefined || distance === undefined || !vehicleId || !driverId) {
    throw new Error('Missing required fields for draft trip creation.');
  }

  // Verify vehicle exists
  const vehicle = await prisma.vehicle.findUnique({ where: { id: Number(vehicleId) } });
  if (!vehicle) {
    throw new Error(`Vehicle with ID ${vehicleId} not found.`);
  }

  // Verify driver exists
  const driver = await prisma.driver.findUnique({ where: { id: Number(driverId) } });
  if (!driver) {
    throw new Error(`Driver with ID ${driverId} not found.`);
  }

  return await prisma.trip.create({
    data: {
      source,
      destination,
      cargoWeight,
      distance,
      revenue,
      vehicleId: Number(vehicleId),
      driverId: Number(driverId),
      status: 'DRAFT'
    }
  });
}

/**
 * Validates availability and driver license, then atomic-dispatches a trip.
 */
export async function dispatchTrip(tripId) {
  const id = Number(tripId);

  // 1. Fetch Trip details including Vehicle and Driver status
  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      vehicle: true,
      driver: true
    }
  });

  if (!trip) {
    throw new Error(`Trip with ID ${tripId} not found.`);
  }

  // 2. Validate current trip status
  if (trip.status !== 'DRAFT') {
    throw new Error(`Trip must be in DRAFT status to dispatch. Current status: ${trip.status}`);
  }

  const { vehicle, driver } = trip;

  if (!vehicle) {
    throw new Error('No vehicle assigned to this trip.');
  }
  if (!driver) {
    throw new Error('No driver assigned to this trip.');
  }

  // 3. Validate Vehicle availability
  if (vehicle.status !== 'AVAILABLE') {
    throw new Error(`Assigned vehicle is not available. Current status: ${vehicle.status}`);
  }

  // 4. Validate Driver availability
  if (driver.status !== 'AVAILABLE') {
    throw new Error(`Assigned driver is not available. Current status: ${driver.status}`);
  }

  // 5. Validate Driver license is not expired
  const now = new Date();
  const expiryDate = new Date(driver.licenseExpiry);
  if (expiryDate <= now) {
    throw new Error(`Driver's license is expired. Expiry date: ${driver.licenseExpiry.toISOString().split('T')[0]}`);
  }

  // 6. Execute atomic transaction
  return await prisma.$transaction(async (tx) => {
    // A. Update trip status
    const updatedTrip = await tx.trip.update({
      where: { id },
      data: {
        status: 'DISPATCHED',
        dispatchedAt: now
      }
    });

    // B. Lock vehicle
    await tx.vehicle.update({
      where: { id: vehicle.id },
      data: { status: 'ON_TRIP' }
    });

    // C. Lock driver
    await tx.driver.update({
      where: { id: driver.id },
      data: { status: 'ON_TRIP' }
    });

    return updatedTrip;
  });
}

/**
 * Atomically completes a dispatched trip and updates vehicle/driver metrics.
 */
export async function completeTrip(tripId) {
  const id = Number(tripId);

  // 1. Fetch Trip with Vehicle and Driver details
  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      vehicle: true,
      driver: true
    }
  });

  if (!trip) {
    throw new Error(`Trip with ID ${tripId} not found.`);
  }

  // 2. Validate current trip status
  if (trip.status !== 'DISPATCHED') {
    throw new Error(`Trip must be in DISPATCHED status to complete. Current status: ${trip.status}`);
  }

  const { vehicle, driver } = trip;
  const now = new Date();

  // 3. Execute atomic transaction
  return await prisma.$transaction(async (tx) => {
    // A. Update trip status
    const updatedTrip = await tx.trip.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: now
      }
    });

    // B. Unlock Vehicle and add distance to odometer
    if (vehicle) {
      await tx.vehicle.update({
        where: { id: vehicle.id },
        data: {
          status: 'AVAILABLE',
          odometer: {
            increment: trip.distance
          }
        }
      });
    }

    // C. Unlock Driver and increment stats
    if (driver) {
      await tx.driver.update({
        where: { id: driver.id },
        data: {
          status: 'AVAILABLE',
          totalTrips: {
            increment: 1
          },
          completedTrips: {
            increment: 1
          }
        }
      });
    }

    return updatedTrip;
  });
}
