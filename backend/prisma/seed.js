/**
 * TransitOps — Full Database Seed
 * Populates: users, vehicles, drivers, trips, maintenance_records, fuel_logs, expenses
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding TransitOps database...\n');

  // ── 1. USERS ──────────────────────────────────────────────────────
  const hashedPw = await bcrypt.hash('password', 10);
  const users = [
    { name: 'Arjun Mehta',     email: 'manager@transitops.in',    role: 'FLEET_MANAGER' },
    { name: 'Ravi Sharma',     email: 'dispatcher@transitops.in', role: 'DISPATCHER' },
    { name: 'Priya Nair',      email: 'safety@transitops.in',     role: 'SAFETY_OFFICER' },
    { name: 'Deepa Iyer',      email: 'analyst@transitops.in',    role: 'FINANCIAL_ANALYST' },
    { name: 'Test User',       email: 'test@transitops.in',       role: 'DISPATCHER' },
  ];
  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { password: hashedPw, name: u.name, role: u.role },
      create: { ...u, password: hashedPw },
    });
  }
  console.log(`✅ ${users.length} users seeded`);

  // ── 2. VEHICLES ───────────────────────────────────────────────────
  const vehicleData = [
    { registrationNumber: 'GJ01AB452', model: 'VAN-05',   type: 'Van',   capacity: 500,  odometer: 74000,  acquisitionCost: 620000,  status: 'AVAILABLE', region: 'Gandhinagar', fuelType: 'Diesel' },
    { registrationNumber: 'GJ01AB998', model: 'TRUCK-11', type: 'Truck', capacity: 5000, odometer: 182000, acquisitionCost: 2450000, status: 'ON_TRIP',   region: 'Ahmedabad',  fuelType: 'Diesel' },
    { registrationNumber: 'GJ01AB120', model: 'MINI-03',  type: 'Mini',  capacity: 1000, odometer: 66000,  acquisitionCost: 410000,  status: 'IN_SHOP',   region: 'Sanand',     fuelType: 'Petrol' },
    { registrationNumber: 'GJ01AB008', model: 'VAN-09',   type: 'Van',   capacity: 750,  odometer: 241900, acquisitionCost: 590000,  status: 'RETIRED',   region: 'Gandhinagar', fuelType: 'Diesel' },
    { registrationNumber: 'GJ01AC301', model: 'TRK-12',   type: 'Truck', capacity: 8000, odometer: 95000,  acquisitionCost: 3200000, status: 'AVAILABLE', region: 'Ahmedabad',  fuelType: 'Diesel' },
    { registrationNumber: 'GJ01AC420', model: 'MINI-08',  type: 'Mini',  capacity: 800,  odometer: 38000,  acquisitionCost: 385000,  status: 'AVAILABLE', region: 'Kalol',      fuelType: 'CNG' },
  ];
  const vehicles = [];
  for (const v of vehicleData) {
    const { fuelType, ...rest } = v;
    const vehicle = await prisma.vehicle.upsert({
      where: { registrationNumber: v.registrationNumber },
      update: rest,
      create: rest,
    });
    vehicles.push(vehicle);
  }
  console.log(`✅ ${vehicles.length} vehicles seeded`);

  // ── 3. DRIVERS ────────────────────────────────────────────────────
  const driverData = [
    { name: 'Alex Kumar',    licenseNumber: 'DL-88213', licenseCategory: 'LMV',    licenseExpiry: new Date('2028-12-31'), contactNumber: '9876543210', safetyScore: 4.8, status: 'ON_TRIP',   totalTrips: 42, completedTrips: 40 },
    { name: 'Suresh Patel',  licenseNumber: 'GJ-12345', licenseCategory: 'HMV',    licenseExpiry: new Date('2026-06-30'), contactNumber: '9876543211', safetyScore: 4.2, status: 'AVAILABLE', totalTrips: 35, completedTrips: 33 },
    { name: 'Rahul Singh',   licenseNumber: 'MH-54321', licenseCategory: 'LMV',    licenseExpiry: new Date('2027-03-15'), contactNumber: '9876543212', safetyScore: 3.9, status: 'AVAILABLE', totalTrips: 28, completedTrips: 25 },
    { name: 'Vikram Joshi',  licenseNumber: 'RJ-99887', licenseCategory: 'HMV',    licenseExpiry: new Date('2025-12-31'), contactNumber: '9876543213', safetyScore: 4.5, status: 'OFF_DUTY',  totalTrips: 51, completedTrips: 48 },
    { name: 'Anita Desai',   licenseNumber: 'GJ-78901', licenseCategory: 'LMV+HMV', licenseExpiry: new Date('2029-01-01'), contactNumber: '9876543214', safetyScore: 4.9, status: 'AVAILABLE', totalTrips: 60, completedTrips: 59 },
  ];
  const drivers = [];
  for (const d of driverData) {
    const driver = await prisma.driver.upsert({
      where: { licenseNumber: d.licenseNumber },
      update: d,
      create: d,
    });
    drivers.push(driver);
  }
  console.log(`✅ ${drivers.length} drivers seeded`);

  // ── 4. TRIPS ──────────────────────────────────────────────────────
  // vehicles[1] = TRUCK-11 (ON_TRIP), drivers[0] = Alex (ON_TRIP)
  const tripData = [
    {
      source: 'Gandhinagar Depot', destination: 'Ahmedabad Warehouse',
      cargoWeight: 3200, distance: 45, revenue: 18000,
      vehicleId: vehicles[1].id, driverId: drivers[0].id,
      status: 'DISPATCHED', dispatchedAt: new Date(Date.now() - 2 * 3600000),
    },
    {
      source: 'Ahmedabad Hub', destination: 'Sanand Factory',
      cargoWeight: 1500, distance: 30, revenue: 12000,
      vehicleId: vehicles[0].id, driverId: drivers[1].id,
      status: 'COMPLETED', dispatchedAt: new Date(Date.now() - 48 * 3600000),
      completedAt: new Date(Date.now() - 44 * 3600000),
    },
    {
      source: 'Kalol Yard', destination: 'Gandhinagar Market',
      cargoWeight: 700, distance: 20, revenue: 6500,
      vehicleId: vehicles[5].id, driverId: drivers[2].id,
      status: 'COMPLETED', dispatchedAt: new Date(Date.now() - 72 * 3600000),
      completedAt: new Date(Date.now() - 69 * 3600000),
    },
    {
      source: 'Sanand Plant', destination: 'Ahmedabad Port',
      cargoWeight: 6000, distance: 55, revenue: 28000,
      vehicleId: vehicles[4].id, driverId: drivers[4].id,
      status: 'DRAFT',
    },
  ];

  const trips = [];
  for (const t of tripData) {
    const trip = await prisma.trip.create({ data: t });
    trips.push(trip);
  }
  console.log(`✅ ${trips.length} trips seeded`);

  // ── 5. MAINTENANCE RECORDS ────────────────────────────────────────
  await prisma.maintenanceRecord.createMany({
    data: [
      { vehicleId: vehicles[2].id, description: 'Engine oil change + filter', cost: 4500,  status: 'ACTIVE',     date: new Date(Date.now() - 2 * 86400000) },
      { vehicleId: vehicles[2].id, description: 'Brake pad replacement',      cost: 8200,  status: 'ACTIVE',     date: new Date(Date.now() - 1 * 86400000) },
      { vehicleId: vehicles[1].id, description: 'Tyre rotation & alignment',  cost: 3100,  status: 'COMPLETED',  date: new Date(Date.now() - 7 * 86400000) },
      { vehicleId: vehicles[0].id, description: 'AC service & regas',         cost: 6000,  status: 'COMPLETED',  date: new Date(Date.now() - 14 * 86400000) },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Maintenance records seeded');

  // ── 6. FUEL LOGS ─────────────────────────────────────────────────
  await prisma.fuelLog.createMany({
    data: [
      { vehicleId: vehicles[1].id, tripId: trips[0].id, liters: 85,  cost: 8500,  date: new Date(Date.now() - 2 * 86400000) },
      { vehicleId: vehicles[0].id, tripId: trips[1].id, liters: 40,  cost: 4000,  date: new Date(Date.now() - 3 * 86400000) },
      { vehicleId: vehicles[5].id, tripId: trips[2].id, liters: 20,  cost: 1800,  date: new Date(Date.now() - 4 * 86400000) },
      { vehicleId: vehicles[4].id, liters: 120, cost: 12000, date: new Date(Date.now() - 1 * 86400000) },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Fuel logs seeded');

  // ── 7. EXPENSES ───────────────────────────────────────────────────
  await prisma.expense.createMany({
    data: [
      { vehicleId: vehicles[1].id, tripId: trips[0].id, type: 'TOLL',        amount: 850,  date: new Date(Date.now() - 2 * 86400000) },
      { vehicleId: vehicles[0].id, tripId: trips[1].id, type: 'TOLL',        amount: 300,  date: new Date(Date.now() - 3 * 86400000) },
      { vehicleId: vehicles[2].id,                      type: 'MAINTENANCE',  amount: 12700,date: new Date(Date.now() - 2 * 86400000) },
      { vehicleId: vehicles[4].id,                      type: 'OTHER',        amount: 2500, date: new Date(Date.now() - 1 * 86400000) },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Expenses seeded');

  console.log('\n🎉 All data seeded successfully!\n');
  console.log('Login Credentials:');
  console.log('─────────────────────────────────────────────');
  console.log('Role              | Email                        | Password');
  console.log('─────────────────────────────────────────────');
  console.log('Fleet Manager     | manager@transitops.in        | password');
  console.log('Dispatcher        | dispatcher@transitops.in     | password');
  console.log('Safety Officer    | safety@transitops.in         | password');
  console.log('Financial Analyst | analyst@transitops.in        | password');
  console.log('─────────────────────────────────────────────');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
