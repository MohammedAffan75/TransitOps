import { useState, useEffect, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Plus, ShieldAlert, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import SearchBar from '../components/common/SearchBar';
import Modal from '../components/common/Modal';
import FormInput from '../components/common/FormInput';
import { useForm } from 'react-hook-form';
import { clsx } from 'clsx';
import api from '../utils/api';

const columnHelper = createColumnHelper();

const statusLabel = { AVAILABLE: 'Available', ON_TRIP: 'On Trip', OFF_DUTY: 'Off Duty', SUSPENDED: 'Suspended' };
const statusButtonColors = {
  Available: 'bg-success/20 text-success border-success/30 hover:bg-success/30',
  'On Trip': 'bg-blue/20 text-blue border-blue/30 hover:bg-blue/30',
  'Off Duty': 'bg-white/10 text-text-secondary border-border hover:bg-white/20',
  Suspended: 'bg-warning/20 text-warning border-warning/30 hover:bg-warning/30',
};
const dbStatus = { Available: 'AVAILABLE', 'On Trip': 'ON_TRIP', 'Off Duty': 'OFF_DUTY', Suspended: 'SUSPENDED' };
const statusCycle = ['Available', 'On Trip', 'Off Duty', 'Suspended'];

export default function Drivers() {
  const [drivers, setDrivers]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/drivers');
      setDrivers(res.data || res);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDrivers(); }, []);

  const updateStatus = async (id, friendlyStatus) => {
    try {
      await api.patch(`/drivers/${id}/status`, { status: dbStatus[friendlyStatus] });
      setDrivers(prev => prev.map(d => d.id === id ? { ...d, status: dbStatus[friendlyStatus] } : d));
    } catch (e) {
      alert('Could not update status: ' + e.message);
    }
  };

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Driver',
      cell: info => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            {info.getValue()[0]}
          </div>
          <span className="font-semibold">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('licenseNumber', {
      header: 'License No.',
      cell: info => <span className="font-mono text-xs text-text-secondary">{info.getValue()}</span>,
    }),
    columnHelper.accessor('licenseCategory', { header: 'Category' }),
    columnHelper.accessor('licenseExpiry', {
      header: 'Expiry',
      cell: info => {
        const d = new Date(info.getValue());
        const expired = d < new Date();
        return (
          <span className={clsx('text-xs font-semibold', expired ? 'text-danger' : 'text-text-secondary')}>
            {d.toLocaleDateString('en-IN', { month: '2-digit', year: 'numeric' })} {expired && '⚠ EXPIRED'}
          </span>
        );
      },
    }),
    columnHelper.accessor('contactNumber', {
      header: 'Contact',
      cell: info => <span className="text-text-secondary">{info.getValue()}</span>,
    }),
    columnHelper.accessor('safetyScore', {
      header: 'Safety Score',
      cell: info => {
        const score = parseFloat(info.getValue() || 0);
        const color = score >= 4.5 ? 'text-success' : score >= 3.5 ? 'text-warning' : 'text-danger';
        return <span className={clsx('font-bold', color)}>{score.toFixed(1)}/5</span>;
      },
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => <StatusBadge status={statusLabel[info.getValue()] || info.getValue()} />,
    }),
    columnHelper.display({
      id: 'toggle',
      header: 'Toggle',
      cell: info => {
        const driver = info.row.original;
        const friendly = statusLabel[driver.status] || driver.status;
        const next = statusCycle[(statusCycle.indexOf(friendly) + 1) % statusCycle.length];
        return (
          <button
            onClick={() => updateStatus(driver.id, next)}
            className={clsx('px-3 py-1 text-xs font-semibold rounded-badge border transition-all duration-200', statusButtonColors[friendly])}
          >
            {friendly} →
          </button>
        );
      },
    }),
  ], [drivers]);

  const onAddDriver = async (data) => {
    try {
      await api.post('/drivers', {
        name: data.name,
        licenseNo: data.licenseNo,
        category: data.category,
        expiry: new Date(data.expiry),
        phone: data.phone,
      });
      await fetchDrivers();
      setShowAddModal(false);
      reset();
    } catch (e) {
      alert('Error adding driver: ' + e.message);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <SearchBar value={globalFilter} onChange={setGlobalFilter} placeholder="Search drivers..." className="w-56" />
        <div className="ml-auto flex gap-2">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={fetchDrivers} className="btn-secondary flex items-center gap-2">
            <RefreshCw size={14} /> Refresh
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={15} /> Add Driver
          </motion.button>
        </div>
      </div>

      {loading && <div className="text-center py-12 text-text-secondary">Loading drivers from database…</div>}
      {error   && <div className="text-center py-4 text-danger text-sm">Error: {error}</div>}

      {!loading && !error && (
        <DataTable columns={columns} data={drivers} globalFilter={globalFilter} onGlobalFilterChange={setGlobalFilter} />
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-2 text-xs text-primary">
        <ShieldAlert size={12} />
        Rule: Expired license or Suspended status → blocked from trip assignment
      </motion.div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Driver">
        <form onSubmit={handleSubmit(onAddDriver)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Full Name" id="name" placeholder="Alex Kumar" register={register} required />
            <FormInput label="License No." id="licenseNo" placeholder="DL-00000" register={register} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Category" id="category" type="select" register={register}
              options={[{ value: 'LMV', label: 'LMV' }, { value: 'HMV', label: 'HMV' }, { value: 'LMV+HMV', label: 'LMV+HMV' }]}
            />
            <FormInput label="License Expiry" id="expiry" type="date" register={register} required />
          </div>
          <FormInput label="Phone" id="phone" placeholder="9876543210" register={register} />
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Add Driver</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
