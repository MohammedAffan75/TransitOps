import { useState } from 'react';
import { Plus, Fuel, Receipt } from 'lucide-react';
import { motion } from 'framer-motion';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import FormInput from '../components/common/FormInput';
import { fuelLogs as initialFuelLogs, expenses as initialExpenses, vehicles } from '../data/mockData';
import { useForm } from 'react-hook-form';

const totalFuelCost = initialFuelLogs.reduce((sum, f) => sum + f.fuelCost, 0);
const totalMaintCost = 26700; // from mock maintenance
const totalOpCost = 34070;

export default function FuelExpense() {
  const [fuelLogs, setFuelLogs] = useState(initialFuelLogs);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [showFuelModal, setShowFuelModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const { register: fuelRegister, handleSubmit: fuelSubmit, reset: fuelReset } = useForm();
  const { register: expRegister, handleSubmit: expSubmit, reset: expReset } = useForm();

  const onAddFuel = (data) => {
    const vehicle = vehicles.find(v => v.name === data.vehicleName);
    const newLog = {
      id: `f${Date.now()}`,
      vehicleId: vehicle?.id || 'v1',
      vehicleName: data.vehicleName,
      date: data.date,
      liters: parseFloat(data.liters) || 0,
      fuelCost: parseFloat(data.fuelCost) || 0,
      tripId: data.tripId || '—',
    };
    setFuelLogs(prev => [...prev, newLog]);
    setShowFuelModal(false);
    fuelReset();
  };

  const onAddExpense = (data) => {
    const newExp = {
      id: `e${Date.now()}`,
      tripId: data.tripId,
      vehicleName: data.vehicleName,
      toll: parseFloat(data.toll) || 0,
      other: parseFloat(data.other) || 0,
      maintenance: parseFloat(data.maintenance) || 0,
      total: (parseFloat(data.toll) || 0) + (parseFloat(data.other) || 0) + (parseFloat(data.maintenance) || 0),
      status: 'Draft',
    };
    setExpenses(prev => [...prev, newExp]);
    setShowExpenseModal(false);
    expReset();
  };

  return (
    <div className="space-y-6">
      {/* Fuel Logs Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Fuel size={15} className="text-primary" />
            Fuel Logs
          </h2>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowFuelModal(true)}
              className="btn-primary flex items-center gap-1.5 text-sm py-2"
            >
              <Plus size={13} />+ Log Fuel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowExpenseModal(true)}
              className="bg-card border border-border hover:bg-white/10 text-white font-semibold px-4 py-2 rounded-btn text-sm flex items-center gap-1.5 transition-all"
            >
              <Plus size={13} />+ Add Expense
            </motion.button>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {['Vehicle', 'Date', 'Liters', 'Fuel Cost'].map(h => (
                <th key={h} className="pb-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider pr-6">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fuelLogs.map((log, i) => (
              <motion.tr
                key={log.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="table-row-hover border-b border-border/40 last:border-0"
              >
                <td className="py-3 pr-6 font-semibold">{log.vehicleName}</td>
                <td className="py-3 pr-6 text-text-secondary">
                  {new Date(log.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="py-3 pr-6 font-semibold text-blue">{log.liters} L</td>
                <td className="py-3 font-semibold text-white">₹{log.fuelCost.toLocaleString()}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Other Expenses */}
      <div className="card">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Receipt size={15} className="text-primary" />
          Other Expenses (Toll / Misc)
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {['Trip', 'Vehicle', 'Toll', 'Other', 'Maint. (Linked)', 'Total'].map(h => (
                <th key={h} className="pb-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp, i) => (
              <motion.tr
                key={exp.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="table-row-hover border-b border-border/40 last:border-0"
              >
                <td className="py-3 pr-4 font-semibold text-primary">{exp.tripId}</td>
                <td className="py-3 pr-4 text-text-secondary">{exp.vehicleName}</td>
                <td className="py-3 pr-4 text-text-secondary">₹{exp.toll}</td>
                <td className="py-3 pr-4 text-text-secondary">₹{exp.other}</td>
                <td className="py-3 pr-4 text-text-secondary">
                  {exp.maintenance > 0 ? `₹${exp.maintenance.toLocaleString()}` : '0'}
                </td>
                <td className="py-3 font-semibold text-white">
                  ₹{exp.total?.toLocaleString() ?? '0'}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {/* Total Operational Cost */}
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <p className="text-xs text-text-secondary font-mono">
            TOTAL OPERATIONAL COST (AUTO) = FUEL + MAINT
          </p>
          <p className="text-xl font-bold text-primary">₹{totalOpCost.toLocaleString()}</p>
        </div>
      </div>

      {/* Add Fuel Modal */}
      <Modal isOpen={showFuelModal} onClose={() => setShowFuelModal(false)} title="Log Fuel Entry">
        <form onSubmit={fuelSubmit(onAddFuel)} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">Vehicle</label>
            <select {...fuelRegister('vehicleName')} className="input-field">
              {vehicles.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Date" id="date" type="date" register={fuelRegister} />
            <FormInput label="Liters" id="liters" type="number" placeholder="42" register={fuelRegister} />
          </div>
          <FormInput label="Fuel Cost (₹)" id="fuelCost" type="number" placeholder="3150" register={fuelRegister} />
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setShowFuelModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Log Fuel</button>
          </div>
        </form>
      </Modal>

      {/* Add Expense Modal */}
      <Modal isOpen={showExpenseModal} onClose={() => setShowExpenseModal(false)} title="Add Expense">
        <form onSubmit={expSubmit(onAddExpense)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Trip ID" id="tripId" placeholder="TR001" register={expRegister} />
            <FormInput label="Vehicle" id="vehicleName" placeholder="VAN-05" register={expRegister} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <FormInput label="Toll (₹)" id="toll" type="number" placeholder="120" register={expRegister} />
            <FormInput label="Other (₹)" id="other" type="number" placeholder="0" register={expRegister} />
            <FormInput label="Maint. (₹)" id="maintenance" type="number" placeholder="0" register={expRegister} />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setShowExpenseModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Add Expense</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
