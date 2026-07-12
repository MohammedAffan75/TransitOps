import { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, CheckCircle, Wrench, Navigation, Clock, UserCheck, Activity } from 'lucide-react';
import KpiCard from '../components/common/KpiCard';
import FilterDropdown from '../components/common/FilterDropdown';
import StatusBadge from '../components/common/StatusBadge';
import { dashboardStats, trips } from '../data/mockData';

const kpis = [
  { label: 'Active Vehicles', value: dashboardStats.activeVehicles, accent: 'blue', icon: Truck },
  { label: 'Available Vehicles', value: dashboardStats.availableVehicles, accent: 'green', icon: CheckCircle },
  { label: 'Vehicles in Maintenance', value: String(dashboardStats.vehiclesInMaintenance).padStart(2, '0'), accent: 'orange', icon: Wrench },
  { label: 'Active Trips', value: dashboardStats.activeTrips, accent: 'blue', icon: Navigation },
  { label: 'Pending Trips', value: String(dashboardStats.pendingTrips).padStart(2, '0'), accent: 'gold', icon: Clock },
  { label: 'Drivers on Duty', value: dashboardStats.driversOnDuty, accent: 'green', icon: UserCheck },
  { label: 'Fleet Utilization', value: `${dashboardStats.fleetUtilization}%`, accent: 'gold', icon: Activity },
];

const vehicleStatusBars = [
  { label: 'Available', value: dashboardStats.vehicleStatus.available, color: 'bg-success' },
  { label: 'On Trip', value: dashboardStats.vehicleStatus.onTrip, color: 'bg-blue' },
  { label: 'In Shop', value: dashboardStats.vehicleStatus.inShop, color: 'bg-warning' },
  { label: 'Retired', value: dashboardStats.vehicleStatus.retired, color: 'bg-danger' },
];

const recentTrips = trips.slice(0, 4);

export default function Dashboard() {
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div>
        <p className="section-title mb-2">Filters</p>
        <div className="flex items-center gap-3 flex-wrap">
          <FilterDropdown
            label="Vehicle Type"
            value={vehicleTypeFilter}
            onChange={setVehicleTypeFilter}
            options={[
              { value: 'van', label: 'Van' },
              { value: 'truck', label: 'Truck' },
              { value: 'mini', label: 'Mini' },
            ]}
            className="w-44"
          />
          <FilterDropdown
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'available', label: 'Available' },
              { value: 'on-trip', label: 'On Trip' },
              { value: 'in-shop', label: 'In Shop' },
            ]}
            className="w-40"
          />
          <FilterDropdown
            label="Region"
            value={regionFilter}
            onChange={setRegionFilter}
            options={[
              { value: 'gandhinagar', label: 'Gandhinagar' },
              { value: 'ahmedabad', label: 'Ahmedabad' },
              { value: 'sanand', label: 'Sanand' },
              { value: 'kalol', label: 'Kalol' },
            ]}
            className="w-40"
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.label} {...kpi} index={i} />
        ))}
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Trips */}
        <div className="lg:col-span-2 card">
          <h2 className="text-sm font-bold text-text-primary mb-4">Recent Trips</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Trip', 'Vehicle', 'Driver', 'Status', 'ETA'].map(h => (
                  <th key={h} className="pb-2.5 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentTrips.map((trip, i) => (
                <motion.tr
                  key={trip.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.06 }}
                  className="table-row-hover border-b border-border/40 last:border-0"
                >
                  <td className="py-3 pr-4 font-semibold text-text-primary">{trip.id}</td>
                  <td className="py-3 pr-4 text-text-secondary">{trip.vehicleName}</td>
                  <td className="py-3 pr-4 text-text-secondary">{trip.driverName}</td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={trip.status} />
                  </td>
                  <td className="py-3 text-text-secondary text-xs">{trip.eta || '—'}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vehicle Status */}
        <div className="card">
          <h2 className="text-sm font-bold text-text-primary mb-5">Vehicle Status</h2>
          <div className="space-y-4">
            {vehicleStatusBars.map(({ label, value, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-text-secondary">{label}</span>
                  <span className="text-xs font-semibold text-text-primary">{value}%</span>
                </div>
                <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${color}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-white/[0.03] rounded-lg">
                <p className="text-lg font-bold text-success">{dashboardStats.vehicleStatus.available}%</p>
                <p className="text-xs text-text-secondary mt-0.5">Availability Rate</p>
              </div>
              <div className="text-center p-3 bg-white/[0.03] rounded-lg">
                <p className="text-lg font-bold text-primary">{dashboardStats.fleetUtilization}%</p>
                <p className="text-xs text-text-secondary mt-0.5">Utilization Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
