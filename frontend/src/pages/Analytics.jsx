import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell,
} from 'recharts';
import KpiCard from '../components/common/KpiCard';
import { Gauge, Activity, DollarSign, TrendingUp, Download, FileText } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import api from '../utils/api';

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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/dashboard/kpis');
        setData(res.data || res);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const exportPDF = () => {
    const element = document.getElementById('analytics-content');
    const opt = {
      margin: 10,
      filename: 'transitops-analytics.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#111217' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const exportCSV = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:5000/api/dashboard/export', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to download CSV');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transitops_analytics.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Error exporting CSV: ' + err.message);
    }
  };

  if (loading) return <div className="text-center py-12 text-text-secondary">Loading analytics...</div>;
  if (error) return <div className="text-center py-4 text-danger text-sm">Error: {error}</div>;
  if (!data) return null;

  const kpis = [
    { label: 'Fuel Efficiency', value: `${data.fuelEfficiency} km/l`, accent: 'green', icon: Gauge },
    { label: 'Fleet Utilization', value: `${data.fleetUtilization}%`, accent: 'blue', icon: Activity },
    { label: 'Operational Cost', value: `₹${data.operationalCost.toLocaleString()}`, accent: 'orange', icon: DollarSign },
    { label: 'Vehicle ROI', value: `${data.vehicleROI}%`, accent: 'gold', icon: TrendingUp },
  ];

  const monthlyRevenue = data.monthlyRevenue || [];
  const costliestVehicles = data.costliestVehicles || [];

  return (
    <div className="space-y-6">
      {/* Header with Export Buttons */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="btn-secondary flex items-center gap-2">
            <FileText size={16} /> Export CSV
          </button>
          <button onClick={exportPDF} className="btn-primary flex items-center gap-2">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div id="analytics-content" className="space-y-6 pb-4">
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
            {monthlyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyRevenue} barSize={28} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#2A2A2A" />
                  <XAxis dataKey="month" tick={{ fill: '#A0A0A0', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#A0A0A0', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                    {monthlyRevenue.map((_, i) => (
                      <Cell key={i} fill={i === monthlyRevenue.length - 1 ? '#C88719' : '#5DA9FF'} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-text-secondary text-sm">No revenue data</div>
            )}
          </div>

          {/* Top Costliest Vehicles */}
          <div className="card">
            <h2 className="text-sm font-bold text-text-primary mb-5">Top Costliest Vehicles</h2>
            <div className="space-y-5">
              {costliestVehicles.length > 0 ? costliestVehicles.map((vehicle, i) => {
                const colors = ['#F87171', '#F4A62A', '#5DA9FF'];
                const pct = vehicle.max > 0 ? Math.round((vehicle.cost / vehicle.max) * 100) : 0;
                return (
                  <motion.div key={vehicle.name} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-text-primary">{vehicle.name}</span>
                      <span className="text-xs text-text-secondary">₹{vehicle.cost.toLocaleString()}</span>
                    </div>
                    <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: 'easeOut' }} className="h-full rounded-full" style={{ backgroundColor: colors[i] }} />
                    </div>
                  </motion.div>
                );
              }) : <div className="text-center text-text-secondary text-sm py-8">No vehicle cost data</div>}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/[0.03] rounded-lg text-center">
                <p className="text-lg font-bold text-success">{data.fleetUtilization}%</p>
                <p className="text-xs text-text-secondary mt-0.5">Utilization</p>
              </div>
              <div className="p-3 bg-white/[0.03] rounded-lg text-center">
                <p className="text-lg font-bold text-primary">{data.fuelEfficiency} km/l</p>
                <p className="text-xs text-text-secondary mt-0.5">Avg Efficiency</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
