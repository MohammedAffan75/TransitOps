import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, CheckCircle, Wrench, Navigation, Clock, UserCheck, Activity, TrendingUp, RefreshCw } from 'lucide-react';
import KpiCard from '../components/common/KpiCard';
import FilterDropdown from '../components/common/FilterDropdown';
import StatusBadge from '../components/common/StatusBadge';
import api from '../utils/api';

const statusLabel = { DRAFT: 'Draft', DISPATCHED: 'Dispatched', COMPLETED: 'Completed', CANCELLED: 'Cancelled' };

export default function Dashboard() {
  const [kpis, setKpis]         = useState(null);
  const [trips, setTrips]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter]           = useState('all');
  const [regionFilter, setRegionFilter]           = useState('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [kpiRes, tripRes] = await Promise.all([
        api.get('/dashboard/kpis'),
        api.get('/trips'),
      ]);
      setKpis(kpiRes.data || kpiRes);
      const allTrips = tripRes.data || tripRes;
      setTrips(allTrips.slice(0, 5)); // show 5 most recent
    } catch (e) {
      console.error('Dashboard fetch error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const kpiCards = [
    { label: 'Active Vehicles',  value: kpis ? String(kpis.totalActiveVehicles).padStart(2, '0') : '—', accent: 'blue',   icon: Truck },
    { label: 'Ongoing Trips',    value: kpis ? String(kpis.ongoingTrips).padStart(2, '0')        : '—', accent: 'blue',   icon: Navigation },
    { label: 'Total Revenue',    value: kpis ? `₹${Number(kpis.totalRevenue).toLocaleString()}`  : '—', accent: 'green',  icon: TrendingUp },
    { label: 'Total Expenses',   value: kpis ? `₹${Number(kpis.totalExpenses).toLocaleString()}` : '—', accent: 'orange', icon: Activity },
    { label: 'In Maintenance',   value: kpis ? String(kpis.vehiclesInMaintenance ?? 0).padStart(2,'0') : '—', accent: 'orange', icon: Wrench },
    { label: 'Completed Trips',  value: kpis ? String(kpis.completedTrips ?? 0).padStart(2, '0') : '—', accent: 'green',  icon: CheckCircle },
    { label: 'Available Drivers',value: kpis ? String(kpis.availableDrivers ?? 0).padStart(2,'0') : '—', accent: 'green',  icon: UserCheck },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div>
        <p className="section-title mb-2">Filters</p>
        <div className="flex items-center gap-3 flex-wrap">
          <FilterDropdown label="Vehicle Type" value={vehicleTypeFilter} onChange={setVehicleTypeFilter}
            options={[{ value: 'van', label: 'Van' }, { value: 'truck', label: 'Truck' }, { value: 'mini', label: 'Mini' }]}
            className="w-44"
          />
          <FilterDropdown label="Status" value={statusFilter} onChange={setStatusFilter}
            options={[{ value: 'available', label: 'Available' }, { value: 'on-trip', label: 'On Trip' }, { value: 'in-shop', label: 'In Shop' }]}
            className="w-40"
          />
          <FilterDropdown label="Region" value={regionFilter} onChange={setRegionFilter}
            options={[{ value: 'gandhinagar', label: 'Gandhinagar' }, { value: 'ahmedabad', label: 'Ahmedabad' }, { value: 'sanand', label: 'Sanand' }, { value: 'kalol', label: 'Kalol' }]}
            className="w-40"
          />
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={fetchData}
            className="btn-secondary flex items-center gap-1.5 text-xs ml-auto">
            <RefreshCw size={12} /> Refresh
          </motion.button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {kpiCards.map((kpi, i) => (
          <KpiCard key={kpi.label} {...kpi} index={i} />
        ))}
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Trips */}
        <div className="lg:col-span-2 card">
          <h2 className="text-sm font-bold text-text-primary mb-4">Recent Trips</h2>
          {loading ? (
            <div className="py-8 text-center text-text-secondary text-sm">Loading trips from database…</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['#ID', 'Route', 'Vehicle', 'Driver', 'Status'].map(h => (
                    <th key={h} className="pb-2.5 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trips.map((trip, i) => (
                  <motion.tr key={trip.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                    className="table-row-hover border-b border-border/40 last:border-0"
                  >
                    <td className="py-3 pr-4 font-semibold text-text-primary">#{trip.id}</td>
                    <td className="py-3 pr-4 text-text-secondary text-xs max-w-[140px] truncate">
                      {trip.source} → {trip.destination}
                    </td>
                    <td className="py-3 pr-4 text-text-secondary">{trip.vehicle?.model || '—'}</td>
                    <td className="py-3 pr-4 text-text-secondary">{trip.driver?.name || '—'}</td>
                    <td className="py-3">
                      <StatusBadge status={statusLabel[trip.status] || trip.status} />
                    </td>
                  </motion.tr>
                ))}
                {trips.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-text-secondary text-sm">No trips in database yet.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Live Stats */}
        <div className="card">
          <h2 className="text-sm font-bold text-text-primary mb-5">Live Database Stats</h2>
          {loading ? (
            <div className="text-center py-8 text-text-secondary text-sm">Loading…</div>
          ) : kpis ? (
            <div className="space-y-4">
              {[
                { label: 'Active Vehicles',  value: kpis.totalActiveVehicles, color: 'bg-blue' },
                { label: 'Vehicles In Shop', value: kpis.vehiclesInMaintenance ?? 0, color: 'bg-warning' },
                { label: 'Ongoing Trips',    value: kpis.ongoingTrips,         color: 'bg-primary' },
                { label: 'Available Drivers',value: kpis.availableDrivers ?? 0, color: 'bg-success' },
              ].map(({ label, value, color }) => (
                <motion.div key={label} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-text-secondary">{label}</span>
                    <span className="text-xs font-semibold text-text-primary">{value}</span>
                  </div>
                  <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (value / 10) * 100)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full ${color}`}
                    />
                  </div>
                </motion.div>
              ))}

              <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-white/[0.03] rounded-lg">
                  <p className="text-lg font-bold text-success">₹{Number(kpis.totalRevenue || 0).toLocaleString()}</p>
                  <p className="text-xs text-text-secondary mt-0.5">Total Revenue</p>
                </div>
                <div className="text-center p-3 bg-white/[0.03] rounded-lg">
                  <p className="text-lg font-bold text-warning">₹{Number(kpis.totalExpenses || 0).toLocaleString()}</p>
                  <p className="text-xs text-text-secondary mt-0.5">Total Expenses</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-text-secondary text-sm">Could not load KPIs.</div>
          )}
        </div>
      </div>
    </div>
  );
}
