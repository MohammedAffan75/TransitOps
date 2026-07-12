import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowRight, Info } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import FormInput from '../components/common/FormInput';
import { maintenanceRecords as initialRecords, vehicles } from '../data/mockData';
import { clsx } from 'clsx';

const serviceTypes = [
  'Oil Change', 'Engine Repair', 'Tyre Replace', 'Brake Inspection',
  'AC Service', 'Battery Replacement', 'Suspension Repair', 'General Checkup',
];

const statusOptions = ['Active', 'Completed', 'Pending'];

export default function Maintenance() {
  const [records, setRecords] = useState(initialRecords);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      status: 'Active',
    },
  });

  const onSave = (data) => {
    const vehicle = vehicles.find(v => v.name === data.vehicle);
    const newRecord = {
      id: `m${Date.now()}`,
      vehicleId: vehicle?.id || 'v1',
      vehicleName: data.vehicle,
      service: data.service,
      cost: parseInt(data.cost) || 0,
      date: data.date,
      status: data.status,
    };
    setRecords(prev => [...prev, newRecord]);
    reset({ date: new Date().toISOString().split('T')[0], status: 'Active' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Form */}
      <div className="space-y-5">
        <div className="card">
          <h2 className="text-sm font-bold text-white mb-5">Log Service Record</h2>
          <form onSubmit={handleSubmit(onSave)} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">Vehicle</label>
              <select {...register('vehicle')} className="input-field">
                {vehicles.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">Service Type</label>
              <select {...register('service')} className="input-field">
                {serviceTypes.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <FormInput label="Cost (₹)" id="cost" type="number" placeholder="2500" register={register} />
            <FormInput label="Date" id="date" type="date" register={register} />
            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">Status</label>
              <select {...register('status')} className="input-field">
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="btn-primary w-full py-3"
            >
              Save
            </motion.button>
          </form>

          {/* Status flow arrows */}
          <div className="mt-5 pt-4 border-t border-border space-y-2">
            <div className="flex items-center gap-3 text-xs">
              <span className="text-success font-semibold">Available</span>
              <ArrowRight size={14} className="text-text-secondary" />
              <span className="text-text-secondary">Creating active record</span>
              <ArrowRight size={14} className="text-text-secondary" />
              <span className="text-warning font-semibold">In Shop</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-warning font-semibold">In Shop</span>
              <ArrowRight size={14} className="text-text-secondary" />
              <span className="text-text-secondary">Closing record (retired)</span>
              <ArrowRight size={14} className="text-text-secondary" />
              <span className="text-success font-semibold">Available</span>
            </div>
            <p className="text-xs text-primary flex items-center gap-1.5 mt-2">
              <Info size={11} />
              Note: In Shop vehicles are removed from the dispatch pool.
            </p>
          </div>
        </div>
      </div>

      {/* Right: Service Log Table */}
      <div className="card">
        <h2 className="text-sm font-bold text-white mb-4">Service Log</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Vehicle', 'Service', 'Cost', 'Status'].map(h => (
                  <th key={h} className="pb-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((record, i) => (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.06 }}
                  className="table-row-hover border-b border-border/40 last:border-0"
                >
                  <td className="py-3 pr-4 font-semibold">{record.vehicleName}</td>
                  <td className="py-3 pr-4 text-text-secondary">{record.service}</td>
                  <td className="py-3 pr-4 font-semibold text-white">₹{record.cost.toLocaleString()}</td>
                  <td className="py-3">
                    <StatusBadge
                      status={record.status === 'Active' ? 'In Shop' : record.status === 'Pending' ? 'Pending' : 'Completed'}
                    />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
