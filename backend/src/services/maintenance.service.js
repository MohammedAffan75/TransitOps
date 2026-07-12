import prisma from '../config/prisma.js';

/**
 * Creates an ACTIVE maintenance record and transitions vehicle status to IN_SHOP.
 */
export async function sendVehicleToShop(data) {
  const { vehicleId, description, cost, date } = data;

  if (!vehicleId || !description || cost === undefined) {
    throw new Error('Missing required fields for maintenance record.');
  }

  // 1. Fetch vehicle status
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: Number(vehicleId) }
  });

  if (!vehicle) {
    throw new Error(`Vehicle with ID ${vehicleId} not found.`);
  }

  // 2. Validate vehicle is not on trip
  if (vehicle.status === 'ON_TRIP') {
    throw new Error(`Vehicle is currently ON_TRIP and cannot be sent to the shop.`);
  }

  const recordDate = date ? new Date(date) : new Date();

  // 3. Execute atomic transaction
  return await prisma.$transaction(async (tx) => {
    // A. Create the active maintenance record
    const maintenanceRecord = await tx.maintenanceRecord.create({
      data: {
        description,
        cost,
        date: recordDate,
        status: 'ACTIVE',
        vehicleId: Number(vehicleId)
      }
    });

    // B. Set vehicle status to IN_SHOP
    await tx.vehicle.update({
      where: { id: Number(vehicleId) },
      data: { status: 'IN_SHOP' }
    });

    return maintenanceRecord;
  });
}

/**
 * Marks maintenance record as COMPLETED and returns vehicle status to AVAILABLE.
 */
export async function completeMaintenance(recordId) {
  const id = Number(recordId);

  // 1. Fetch maintenance record with vehicle details
  const record = await prisma.maintenanceRecord.findUnique({
    where: { id },
    include: { vehicle: true }
  });

  if (!record) {
    throw new Error(`Maintenance record with ID ${recordId} not found.`);
  }

  // 2. Validate record is active
  if (record.status !== 'ACTIVE') {
    throw new Error(`Maintenance record is already in ${record.status} status.`);
  }

  // 3. Execute atomic transaction
  return await prisma.$transaction(async (tx) => {
    // A. Update maintenance status to COMPLETED
    const updatedRecord = await tx.maintenanceRecord.update({
      where: { id },
      data: { status: 'COMPLETED' }
    });

    // B. Restore vehicle status back to AVAILABLE
    await tx.vehicle.update({
      where: { id: record.vehicleId },
      data: { status: 'AVAILABLE' }
    });

    return updatedRecord;
  });
}
