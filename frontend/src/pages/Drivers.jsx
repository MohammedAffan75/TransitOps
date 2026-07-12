import { useState, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Plus, Info, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import SearchBar from '../components/common/SearchBar';
import Modal from '../components/common/Modal';
import FormInput from '../components/common/FormInput';
import { drivers as initialDrivers } from '../data/mockData';
import { useForm } from 'react-hook-form';
import { clsx } from 'clsx';

const columnHelper = createColumnHelper();

const statusOptions = ['Available', 'On Trip', 'Off Duty', 'Suspended'];
const statusButtonColors = {
  Available: 'bg-success/20 text-success border-success/30 hover:bg-success/30',
  'On Trip': 'bg-blue/20 text-blue border-blue/30 hover:bg-blue/30',
  'Off Duty': 'bg-white/10 text-text-secondary border-border hover:bg-white/20',
  Suspended: 'bg-warning/20 text-warning border-warning/30 hover:bg-warning/30',
};

export default function Drivers() {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const updateStatus = (id, newStatus) => {
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
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
    columnHelper.accessor('licenseNo', {
      header: 'License No.',
      cell: info => <span className="font-mono text-xs text-text-secondary">{info.getValue()}</span>,
    }),
    columnHelper.accessor('category', { header: 'Category' }),
    columnHelper.accessor('expiry', {
      header: 'Expiry',
      cell: info => {
        const isExpired = info.row.original.licenseStatus === 'Expired';
        return (
          <span className={clsx('text-xs font-semibold', isExpired ? 'text-danger' : 'text-text-secondary')}>
            {info.getValue()} {isExpired && 'EXPIRED'}
          </span>
        );
      },
    }),
    columnHelper.accessor('phone', {
      header: 'Contact',
      cell: info => <span className="text-text-secondary">{info.getValue()}</span>,
    }),
    columnHelper.accessor('safetyScore', {
      header: 'Safety',
      cell: info => {
        const score = info.getValue();
        const color = score >= 90 ? 'text-success' : score >= 75 ? 'text-warning' : 'text-danger';
        return <span className={clsx('font-bold', color)}>{score}%</span>;
      },
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => <StatusBadge status={info.getValue()} />,
    }),
    columnHelper.display({
      id: 'toggle',
      header: 'Toggle Status',
      cell: info => {
        const driver = info.row.original;
        const nextStatus = statusOptions[(statusOptions.indexOf(driver.status) + 1) % statusOptions.length];
        return (
          <button
            onClick={() => updateStatus(driver.id, nextStatus)}
            className={clsx(
              'px-3 py-1 text-xs font-semibold rounded-badge border transition-all duration-200',
              statusButtonColors[driver.status]
            )}
          >
            {driver.status}
          </button>
        );
      },
    }),
  ], [drivers]);

  const onAddDriver = (data) => {
    const newDriver = {
      id: `d${Date.now()}`,
      name: data.name,
      licenseNo: data.licenseNo,
      category: data.category,
      expiry: data.expiry,
      phone: data.phone,
      safetyScore: 100,
      tripCompletion: 100,
      status: 'Available',
      licenseStatus: 'Valid',
    };
    setDrivers(prev => [...prev, newDriver]);
    setShowAddModal(false);
    reset();
  };

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex items-center gap-3 flex-wrap">
        <SearchBar
          value={globalFilter}
          onChange={setGlobalFilter}
          placeholder="Search drivers..."
          className="w-56"
        />
        <div className="ml-auto">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={15} />
            + Add Driver
          </motion.button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={drivers}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
      />

      {/* Status toggle legend */}
      <div className="flex items-center gap-3 flex-wrap">
        {statusOptions.map(s => (
          <span key={s} className={clsx('badge border', statusButtonColors[s])}>{s}</span>
        ))}
      </div>

      {/* Rule note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2 text-xs text-primary"
      >
        <ShieldAlert size={12} />
        Rule: Expired license or Suspended status → blocked from trip assignment
      </motion.div>

      {/* Add Driver Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Driver">
        <form onSubmit={handleSubmit(onAddDriver)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Full Name" id="name" placeholder="Alex Kumar" register={register} required />
            <FormInput label="License No." id="licenseNo" placeholder="DL-00000" register={register} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Category"
              id="category"
              type="select"
              register={register}
              options={[
                { value: 'LMV', label: 'LMV (Light Motor Vehicle)' },
                { value: 'HMV', label: 'HMV (Heavy Motor Vehicle)' },
              ]}
            />
            <FormInput label="License Expiry" id="expiry" placeholder="MM/YYYY" register={register} required />
          </div>
          <FormInput label="Phone" id="phone" placeholder="98765xxxxx" register={register} />
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Add Driver</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
