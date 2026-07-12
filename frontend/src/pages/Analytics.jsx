import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell,
} from 'recharts';
import KpiCard from '../components/common/KpiCard';
import { analyticsData } from '../data/mockData';
import { Gauge, Activity, DollarSign, TrendingUp } from 'lucide-react';

const kpis = [
  { label: 'Fuel Efficiency', value: `${analyticsData.fuelEfficiency} km/l`, accent: 'green', icon: Gauge },
  { label: 'Fleet Utilization', value: `${analyticsData.fleetUtilization}%`, accent: 'blue', icon: Activity },
  { label: 'Operational Cost', value: `₹${analyticsData.operationalCost.toLocaleString()}`, accent: 'orange', icon: DollarSign },
  { label: 'Vehicle ROI', value: `${analyticsData.vehicleROI}%`, accent: 'gold', icon: TrendingUp },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-card px-3 py-2 shadow-card">
        <p className="text-xs text-text-secondary">{label}</p>
        <p className="text-sm font-bold text-primary">₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.label} {...kpi} index={i} />
        ))}
      </div>

      {/* ROI Formula */}
      <p className="text-xs text-text-secondary font-mono">
        ROI = (Revenue − (Maintenance + Fuel)) / Acquisition Cost
      </p>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Bar Chart */}
        <div className="card">
          <h2 className="text-sm font-bold text-text-primary mb-5">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analyticsData.monthlyRevenue} barSize={28} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis
                dataKey="month"
                tick={{ fill: '#A0A0A0', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#A0A0A0', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                {analyticsData.monthlyRevenue.map((_, i) => (
                  <Cell
                    key={i}
                    fill={i === analyticsData.monthlyRevenue.length - 1 ? '#C88719' : '#5DA9FF'}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Costliest Vehicles */}
        <div className="card">
          <h2 className="text-sm font-bold text-text-primary mb-5">Top Costliest Vehicles</h2>
          <div className="space-y-5">
            {analyticsData.costliestVehicles.map((vehicle, i) => {
              const colors = ['#F87171', '#F4A62A', '#5DA9FF'];
              const pct = Math.round((vehicle.cost / vehicle.max) * 100);
              return (
                <motion.div
                  key={vehicle.name}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-text-primary">{vehicle.name}</span>
                    <span className="text-xs text-text-secondary">₹{vehicle.cost.toLocaleString()}</span>
                  </div>
                  <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: colors[i] }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 gap-4">
            <div className="p-3 bg-white/[0.03] rounded-lg text-center">
              <p className="text-lg font-bold text-success">{analyticsData.fleetUtilization}%</p>
              <p className="text-xs text-text-secondary mt-0.5">Utilization</p>
            </div>
            <div className="p-3 bg-white/[0.03] rounded-lg text-center">
              <p className="text-lg font-bold text-primary">{analyticsData.fuelEfficiency} km/l</p>
              <p className="text-xs text-text-secondary mt-0.5">Avg Efficiency</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
