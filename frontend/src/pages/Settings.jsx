import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { CheckCircle, Minus } from 'lucide-react';
import { settingsData, rbacData } from '../data/mockData';

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      depotName: settingsData.depotName,
      currency: settingsData.currency,
      distanceUnit: settingsData.distanceUnit,
    },
  });

  const onSave = (data) => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* General Settings */}
      <div className="card">
        <h2 className="text-sm font-bold text-white mb-5">General</h2>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">Depot Name</label>
            <input
              {...register('depotName')}
              className="input-field"
              placeholder="Gandhinagar Depot GJ4"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">Currency</label>
            <input
              {...register('currency')}
              className="input-field"
              placeholder="INR (Rs)"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">Distance Unit</label>
            <select {...register('distanceUnit')} className="input-field">
              <option value="Kilometers">Kilometers</option>
              <option value="Miles">Miles</option>
            </select>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-btn font-semibold text-sm transition-all duration-300 ${
              saved
                ? 'bg-success/20 text-success border border-success/30'
                : 'btn-primary'
            }`}
          >
            {saved ? (
              <>
                <CheckCircle size={15} />
                Saved!
              </>
            ) : (
              'Save Changes'
            )}
          </motion.button>
        </form>
      </div>

      {/* RBAC Table */}
      <div className="card">
        <h2 className="text-sm font-bold text-white mb-5">Role-Based Access (RBAC)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Role', 'Fleet', 'Drivers', 'Trips', 'Fuel/Exp.', 'Analytics'].map(h => (
                  <th key={h} className="pb-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider pr-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rbacData.map((row, i) => (
                <motion.tr
                  key={row.role}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.07 }}
                  className="table-row-hover border-b border-border/40 last:border-0"
                >
                  <td className="py-3 pr-3 font-semibold text-white">{row.role}</td>
                  {[
                    row.fleet, row.drivers, row.trips, row.fuelExp, row.analytics
                  ].map((val, j) => (
                    <td key={j} className="py-3 pr-3">
                      {val === true ? (
                        <CheckCircle size={15} className="text-success" />
                      ) : val === 'View' ? (
                        <span className="text-xs text-blue font-semibold">View</span>
                      ) : (
                        <Minus size={14} className="text-text-secondary/40" />
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-5 pt-4 border-t border-border flex items-center gap-5">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <CheckCircle size={12} className="text-success" />
            Full Access
          </div>
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <span className="text-xs text-blue font-semibold">View</span>
            View Only
          </div>
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Minus size={12} className="text-text-secondary/40" />
            No Access
          </div>
        </div>
      </div>
    </div>
  );
}
