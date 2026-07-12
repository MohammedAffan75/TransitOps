import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Fuel, Plus, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
import api from '../utils/api';

const expenseTypeColors = {
  TOLL: 'bg-blue/20 text-blue border-blue/30',
  MAINTENANCE: 'bg-warning/20 text-warning border-warning/30',
  OTHER: 'bg-white/10 text-text-secondary border-border',
};

export default function FuelExpense() {
  const [fuelLogs, setFuelLogs]   = useState([]);
  const [expenses, setExpenses]   = useState([]);
  const [vehicles, setVehicles]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState('fuel');
  const [flash, setFlash]         = useState(null);

  const fuelForm    = useForm({ defaultValues: { date: new Date().toISOString().split('T')[0] } });
  const expenseForm = useForm({ defaultValues: { date: new Date().toISOString().split('T')[0], type: 'TOLL' } });

  const showFlash = (msg, isError = false) => {
    setFlash({ text: msg, error: isError });
    setTimeout(() => setFlash(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fRes, eRes, vRes] = await Promise.all([
        api.get('/expenses/fuel'),
        api.get('/expenses/other'),
        api.get('/vehicles'),
      ]);
      setFuelLogs(fRes.data || fRes);
      setExpenses(eRes.data || eRes);
      setVehicles(vRes.data || vRes);
    } catch (e) {
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onAddFuel = async (data) => {
    try {
      await api.post('/expenses/fuel', {
        vehicleId: Number(data.vehicleId),
        liters: parseFloat(data.liters),
        cost: parseFloat(data.cost),
        date: new Date(data.date),
      });
      fuelForm.reset({ date: new Date().toISOString().split('T')[0] });
      await fetchData();
      showFlash('✅ Fuel log added!');
    } catch (e) { showFlash(e.message, true); }
  };

  const onAddExpense = async (data) => {
    try {
      await api.post('/expenses/other', {
        vehicleId: Number(data.vehicleId),
        type: data.type,
        amount: parseFloat(data.amount),
        date: new Date(data.date),
      });
      expenseForm.reset({ date: new Date().toISOString().split('T')[0], type: 'TOLL' });
      await fetchData();
      showFlash('✅ Expense added!');
    } catch (e) { showFlash(e.message, true); }
  };

  // Summary numbers
  const totalFuelCost  = fuelLogs.reduce((s, l) => s + Number(l.cost), 0);
  const totalFuelLiters = fuelLogs.reduce((s, l) => s + Number(l.liters), 0);
  const totalExpenses  = expenses.reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div className="space-y-5">
      {/* Flash */}
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

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Fuel Cost', value: `₹${totalFuelCost.toLocaleString()}`, color: 'text-primary' },
          { label: 'Total Litres',    value: `${totalFuelLiters.toFixed(0)} L`,      color: 'text-blue' },
          { label: 'Other Expenses',  value: `₹${totalExpenses.toLocaleString()}`,   color: 'text-warning' },
        ].map(c => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card text-center">
            <p className={clsx('text-xl font-bold', c.color)}>{c.value}</p>
            <p className="text-xs text-text-secondary mt-1">{c.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Form Panel ── */}
        <div className="lg:col-span-2 card">
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {['fuel', 'expense'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={clsx('flex-1 py-1.5 text-xs font-semibold rounded-badge border transition-all', tab === t
                  ? 'bg-primary text-white border-primary'
                  : 'text-text-secondary border-border hover:border-primary'
                )}
              >
                {t === 'fuel' ? '⛽ Fuel Log' : '💳 Other Expense'}
              </button>
            ))}
          </div>

          {tab === 'fuel' ? (
            <form onSubmit={fuelForm.handleSubmit(onAddFuel)} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">Vehicle</label>
                <select {...fuelForm.register('vehicleId')} className="input-field w-full text-sm" required>
                  <option value="">— Select —</option>
                  {vehicles.map(v => <option key={v.id} value={v.id}>{v.model} ({v.registrationNumber})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">Litres</label>
                  <input {...fuelForm.register('liters')} type="number" step="0.1" placeholder="50" className="input-field w-full text-sm" required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">Cost (₹)</label>
                  <input {...fuelForm.register('cost')} type="number" placeholder="5000" className="input-field w-full text-sm" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">Date</label>
                <input {...fuelForm.register('date')} type="date" className="input-field w-full text-sm" />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <Fuel size={13} /> Add Fuel Log
              </button>
            </form>
          ) : (
            <form onSubmit={expenseForm.handleSubmit(onAddExpense)} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">Vehicle</label>
                <select {...expenseForm.register('vehicleId')} className="input-field w-full text-sm" required>
                  <option value="">— Select —</option>
                  {vehicles.map(v => <option key={v.id} value={v.id}>{v.model} ({v.registrationNumber})</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">Type</label>
                <select {...expenseForm.register('type')} className="input-field w-full text-sm">
                  <option value="TOLL">Toll</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">Amount (₹)</label>
                  <input {...expenseForm.register('amount')} type="number" placeholder="1000" className="input-field w-full text-sm" required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">Date</label>
                  <input {...expenseForm.register('date')} type="date" className="input-field w-full text-sm" />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <Plus size={13} /> Add Expense
              </button>
            </form>
          )}
        </div>

        {/* ── Data List ── */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-text-primary">
              {tab === 'fuel' ? `Fuel Logs (${fuelLogs.length})` : `Expenses (${expenses.length})`}
            </h2>
            <motion.button whileHover={{ scale: 1.05 }} onClick={fetchData} className="btn-secondary flex items-center gap-1.5 text-xs">
              <RefreshCw size={12} /> Refresh
            </motion.button>
          </div>

          {loading && <div className="text-center py-8 text-text-secondary text-sm">Loading…</div>}

          {!loading && tab === 'fuel' && fuelLogs.map((log, i) => (
            <motion.div key={log.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-text-primary text-sm">{log.vehicle?.model} <span className="text-xs text-text-secondary">({log.vehicle?.registrationNumber})</span></p>
                  <p className="text-xs text-text-secondary mt-0.5">{Number(log.liters)} L &nbsp;·&nbsp; ₹{Number(log.cost).toLocaleString()} &nbsp;·&nbsp; {new Date(log.date).toLocaleDateString('en-IN')}</p>
                  {log.trip && <p className="text-xs text-primary mt-0.5">Trip #{log.trip.id}: {log.trip.source} → {log.trip.destination}</p>}
                </div>
                <Fuel size={18} className="text-primary/40" />
              </div>
            </motion.div>
          ))}

          {!loading && tab === 'expense' && expenses.map((exp, i) => (
            <motion.div key={exp.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={clsx('px-2 py-0.5 text-xs font-semibold rounded-badge border', expenseTypeColors[exp.type] || expenseTypeColors.OTHER)}>{exp.type}</span>
                    <p className="font-semibold text-text-primary text-sm">{exp.vehicle?.model}</p>
                  </div>
                  <p className="text-xs text-text-secondary">₹{Number(exp.amount).toLocaleString()} &nbsp;·&nbsp; {new Date(exp.date).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {!loading && tab === 'fuel' && fuelLogs.length === 0 && (
            <div className="text-center py-12 text-text-secondary text-sm">No fuel logs yet.</div>
          )}
          {!loading && tab === 'expense' && expenses.length === 0 && (
            <div className="text-center py-12 text-text-secondary text-sm">No expenses yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
