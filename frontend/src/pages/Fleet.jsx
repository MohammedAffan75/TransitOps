import { useState, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Plus, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import FilterDropdown from '../components/common/FilterDropdown';
import SearchBar from '../components/common/SearchBar';
import Modal from '../components/common/Modal';
import FormInput from '../components/common/FormInput';
import { vehicles as initialVehicles } from '../data/mockData';
import { useForm } from 'react-hook-form';

const columnHelper = createColumnHelper();

export default function Fleet() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [globalFilter, setGlobalFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const filtered = useMemo(() => {
    return vehicles.filter(v => {
      if (typeFilter !== 'all' && v.type.toLowerCase() !== typeFilter) return false;
      if (statusFilter !== 'all' && v.status.toLowerCase().replace(' ', '-') !== statusFilter) return false;
      return true;
    });
  }, [vehicles, typeFilter, statusFilter]);

  const columns = useMemo(() => [
    columnHelper.accessor('registration', {
      header: 'Reg. No. (Unique)',
      cell: info => <span className="font-mono text-primary font-semibold text-xs">{info.getValue()}</span>,
    }),
    columnHelper.accessor('name', {
      header: 'Name/Model',
      cell: info => <span className="font-semibold">{info.getValue()}</span>,
    }),
    columnHelper.accessor('type', { header: 'Type' }),
    columnHelper.accessor('capacity', { header: 'Capacity' }),
    columnHelper.accessor('odometer', {
      header: 'Odometer',
      cell: info => <span>{info.getValue().toLocaleString()}</span>,
    }),
    columnHelper.accessor('acquisitionCost', {
      header: 'Acq. Cost',
      cell: info => <span>₹{info.getValue().toLocaleString()}</span>,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => <StatusBadge status={info.getValue()} />,
    }),
  ], []);

  const onAddVehicle = (data) => {
    const newVehicle = {
      id: `v${Date.now()}`,
      registration: data.registration,
      name: data.name,
      type: data.type,
      capacity: data.capacity,
      capacityKg: parseInt(data.capacity) || 0,
      odometer: parseInt(data.odometer) || 0,
      acquisitionCost: parseInt(data.acquisitionCost) || 0,
      status: 'Available',
      region: data.region || 'Gandhinagar',
    };
    setVehicles(prev => [...prev, newVehicle]);
    setShowAddModal(false);
    reset();
  };

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex items-center gap-3 flex-wrap">
        <FilterDropdown
          label="Type"
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { value: 'van', label: 'Van' },
            { value: 'truck', label: 'Truck' },
            { value: 'mini', label: 'Mini' },
          ]}
          className="w-40"
        />
        <FilterDropdown
          label="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'available', label: 'Available' },
            { value: 'on-trip', label: 'On Trip' },
            { value: 'in-shop', label: 'In Shop' },
            { value: 'retired', label: 'Retired' },
          ]}
          className="w-40"
        />
        <SearchBar
          value={globalFilter}
          onChange={setGlobalFilter}
          placeholder="Search reg. no..."
          className="w-52"
        />
        <div className="ml-auto">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={15} />
            + Add Vehicle
          </motion.button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
      />

      {/* Rule note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2 text-xs text-primary"
      >
        <Info size={12} />
        Rule: Registration No. must be unique · Retired/In Shop vehicles are hidden from Trip Dispatcher
      </motion.div>

      {/* Add Vehicle Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Vehicle">
        <form onSubmit={handleSubmit(onAddVehicle)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Registration No." id="registration" placeholder="GJ01XX000" register={register} required />
            <FormInput label="Vehicle Name" id="name" placeholder="VAN-10" register={register} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Type"
              id="type"
              type="select"
              register={register}
              options={[
                { value: 'Van', label: 'Van' },
                { value: 'Truck', label: 'Truck' },
                { value: 'Mini', label: 'Mini' },
              ]}
            />
            <FormInput label="Capacity (kg)" id="capacity" placeholder="500 kg" register={register} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Odometer (km)" id="odometer" type="number" placeholder="0" register={register} />
            <FormInput label="Acquisition Cost (₹)" id="acquisitionCost" type="number" placeholder="500000" register={register} />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Add Vehicle</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
