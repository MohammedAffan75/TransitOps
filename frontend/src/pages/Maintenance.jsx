import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, CheckCircle, RefreshCw, Info } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import FormInput from '../components/common/FormInput';
import { clsx } from 'clsx';
import api from '../utils/api';

const serviceTypes = [
  'Oil Change', 'Engine Repair', 'Tyre Replace', 'Brake Inspection',
  'AC Service', 'Battery Replacement', 'Suspension Repair', 'General Checkup',
];

const statusLabel = { ACTIVE: 'Active', COMPLETED: 'Completed' };
const statusColor  = { ACTIVE: 'text-warning', COMPLETED: 'text-success' };

export default function Maintenance() {
  const [records, setRecords]   = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [flash, setFlash]       = useState(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { date: new Date().toISOString().split('T')[0] },
  });

  const showFlash = (msg, isError = false) => {
    setFlash({ text: msg, error: isError });
    setTimeout(() => setFlash(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recRes, vRes] = await Promise.all([
        api.get('/maintenance'),
        api.get('/vehicles'),
      ]);
      setRecords(recRes.data || recRes);
      setVehicles(vRes.data || vRes);
    } catch (e) {
      showFlash(e.message, true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onSave = async (data) => {
    try {
      await api.post('/maintenance', {
        vehicleId: Number(data.vehicleId),
        description: data.service,
        cost: parseFloat(data.cost) || 0,
        date: new Date(data.date),
      });
      reset({ date: new Date().toISOString().split('T')[0] });
      await fetchData();
      showFlash('✅ Vehicle sent to maintenance!');
    } catch (e) {
      showFlash(e.message, true);
    }
  };

  const handleComplete = async (id) => {
    try {
      await api.post(`/maintenance/${id}/complete`);
      await fetchData();
      showFlash('✅ Maintenance completed! Vehicle returned to fleet.');
    } catch (e) {
      showFlash(e.message, true);
    }
  };

  // Only AVAILABLE vehicles can be sent to shop
  const shopableVehicles = vehicles.filter(v => v.status === 'AVAILABLE' || v.status === 'IN_SHOP');

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {flash && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={clsx('p-3 rounded-card text-sm font-medium border', flash.error
              ? 'bg-danger/10 text-danger border-danger/30'
              : 'bg-success/10 text-success border-success/30'
            )}
          >
            {flash.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Form ── */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 card">
          <h2 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
            <Wrench size={14} className="text-primary" /> Log Maintenance
          </h2>
          <form onSubmit={handleSubmit(onSave)} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">Vehicle</label>
              <select {...register('vehicleId')} className="input-field w-full text-sm" required>
                <option value="">— Select Vehicle —</option>
                {shopableVehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.model} ({v.registrationNumber})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">Service Type</label>
              <select {...register('service')} className="input-field w-full text-sm">
                {serviceTypes.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Cost (₹)" id="cost" type="number" placeholder="5000" register={register} />
              <FormInput label="Date" id="date" type="date" register={register} />
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <Wrench size={14} /> Send to Shop
            </button>
          </form>

          <div className="mt-3 flex items-center gap-2 text-xs text-primary">
            <Info size={11} /> Sending a vehicle to shop marks it IN_SHOP, removing it from the dispatch pool.
          </div>
        </motion.div>

        {/* ── Records List ── */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-text-primary">Maintenance Records ({records.length})</h2>
            <motion.button whileHover={{ scale: 1.05 }} onClick={fetchData} className="btn-secondary flex items-center gap-1.5 text-xs">
              <RefreshCw size={12} /> Refresh
            </motion.button>
          </div>

          {loading && <div className="text-center py-8 text-text-secondary text-sm">Loading records…</div>}

          {!loading && records.map((rec, i) => (
            <motion.div key={rec.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="card p-4 flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-text-primary text-sm">#{rec.id}</span>
                  <span className={clsx('text-xs font-semibold', statusColor[rec.status] || 'text-text-secondary')}>
                    ● {statusLabel[rec.status] || rec.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-text-primary">{rec.description}</p>
                <p className="text-xs text-text-secondary mt-0.5">
                  Vehicle: <span className="text-text-primary">{rec.vehicle?.model} ({rec.vehicle?.registrationNumber})</span>
                </p>
                <p className="text-xs text-text-secondary">
                  Cost: ₹{Number(rec.cost).toLocaleString()} &nbsp;·&nbsp;
                  Date: {new Date(rec.date).toLocaleDateString('en-IN')}
                </p>
              </div>
              {rec.status === 'ACTIVE' && (
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => handleComplete(rec.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-badge bg-success/20 text-success border border-success/30 hover:bg-success/30 transition-all flex-shrink-0"
                >
                  <CheckCircle size={12} /> Mark Complete
                </motion.button>
              )}
            </motion.div>
          ))}

          {!loading && records.length === 0 && (
            <div className="text-center py-12 text-text-secondary text-sm">No maintenance records. Log one using the form.</div>
          )}
        </div>
      </div>
    </div>
  );
}
