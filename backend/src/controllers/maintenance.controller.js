import * as maintenanceService from '../services/maintenance.service.js';

/**
 * Handle POST /api/maintenance
 * Sends a vehicle to the maintenance shop.
 */
export async function sendVehicleToShop(req, res) {
  try {
    const record = await maintenanceService.sendVehicleToShop(req.body);
    return res.status(201).json({
      message: 'Vehicle successfully sent to shop.',
      record
    });
  } catch (error) {
    console.error('Error in sendVehicleToShop controller:', error);
    return res.status(400).json({ error: error.message });
  }
}

/**
 * Handle POST /api/maintenance/:id/complete
 * Marks maintenance complete and returns vehicle to dispatch pool.
 */
export async function completeMaintenance(req, res) {
  try {
    const { id } = req.params;
    const record = await maintenanceService.completeMaintenance(id);
    return res.status(200).json({
      message: 'Maintenance completed successfully. Vehicle returned to dispatchable pool.',
      record
    });
  } catch (error) {
    console.error('Error in completeMaintenance controller:', error);
    return res.status(400).json({ error: error.message });
  }
}
