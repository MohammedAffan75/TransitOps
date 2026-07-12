import { useState, useEffect, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Plus, Info, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import FilterDropdown from '../components/common/FilterDropdown';
import SearchBar from '../components/common/SearchBar';
import Modal from '../components/common/Modal';
import FormInput from '../components/common/FormInput';
import { useForm } from 'react-hook-form';
import api from '../utils/api';

const columnHelper = createColumnHelper();

/** Map DB enum → friendly label */
const statusLabel = { AVAILABLE: 'Available', ON_TRIP: 'On Trip', IN_SHOP: 'In Shop', RETIRED: 'Retired' };

export default function Fleet() {
  const [vehicles, setVehicles]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [typeFilter, setTypeFilter]   = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vehicles');
      setVehicles(res.data || res);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVehicles(); }, []);

  const filtered = useMemo(() => {
    return vehicles.filter(v => {
      if (typeFilter !== 'all' && v.type.toLowerCase() !== typeFilter) return false;
      if (statusFilter !== 'all' && v.status !== statusFilter.toUpperCase().replace('-', '_')) return false;
      return true;
    });
  }, [vehicles, typeFilter, statusFilter]);

  const columns = useMemo(() => [
    columnHelper.accessor('registrationNumber', {
      header: 'Reg. No.',
      cell: info => <span className="font-mono text-primary font-semibold text-xs">{info.getValue()}</span>,
    }),
    columnHelper.accessor('model', {
      header: 'Name/Model',
      cell: info => <span className="font-semibold">{info.getValue()}</span>,
    }),
    columnHelper.accessor('type', { header: 'Type' }),
    columnHelper.accessor('capacity', {
      header: 'Capacity (kg)',
      cell: info => <span>{Number(info.getValue()).toLocaleString()}</span>,
    }),
    columnHelper.accessor('odometer', {
      header: 'Odometer (km)',
      cell: info => <span>{Number(info.getValue()).toLocaleString()}</span>,
    }),
    columnHelper.accessor('acquisitionCost', {
      header: 'Acq. Cost',
      cell: info => <span>₹{Number(info.getValue()).toLocaleString()}</span>,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => <StatusBadge status={statusLabel[info.getValue()] || info.getValue()} />,
    }),
  ], []);

  const onAddVehicle = async (data) => {
    try {
      await api.post('/vehicles', {
        registration: data.registration,
        name: data.name,
        type: data.type,
        capacityKg: parseFloat(data.capacity) || 0,
        odometer: parseFloat(data.odometer) || 0,
        acquisitionCost: parseFloat(data.acquisitionCost) || 0,
        region: data.region || 'Gandhinagar',
      });
      await fetchVehicles();
      setShowAddModal(false);
      reset();
    } catch (e) {
      alert('Error adding vehicle: ' + e.message);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex items-center gap-3 flex-wrap">
        <FilterDropdown label="Type" value={typeFilter} onChange={setTypeFilter}
          options={[{ value: 'van', label: 'Van' }, { value: 'truck', label: 'Truck' }, { value: 'mini', label: 'Mini' }]}
          className="w-40"
        />
        <FilterDropdown label="Status" value={statusFilter} onChange={setStatusFilter}
          options={[{ value: 'available', label: 'Available' }, { value: 'on_trip', label: 'On Trip' }, { value: 'in_shop', label: 'In Shop' }, { value: 'retired', label: 'Retired' }]}
          className="w-40"
        />
        <SearchBar value={globalFilter} onChange={setGlobalFilter} placeholder="Search reg. no..." className="w-52" />
        <div className="ml-auto flex gap-2">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={fetchVehicles} className="btn-secondary flex items-center gap-2">
            <RefreshCw size={14} /> Refresh
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={15} /> Add Vehicle
          </motion.button>
        </div>
      </div>

      {/* Loading / Error states */}
      {loading && <div className="text-center py-12 text-text-secondary">Loading vehicles from database…</div>}
      {error   && <div className="text-center py-4 text-danger text-sm">Error: {error}</div>}

      {!loading && !error && (
        <DataTable columns={columns} data={filtered} globalFilter={globalFilter} onGlobalFilterChange={setGlobalFilter} />
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-2 text-xs text-primary">
        <Info size={12} />
        Rule: Registration No. must be unique · Retired/In Shop vehicles are hidden from Trip Dispatcher
      </motion.div>

      {/* Add Vehicle Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Vehicle">
        <form onSubmit={handleSubmit(onAddVehicle)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Registration No." id="registration" placeholder="GJ01XX000" register={register} required />
            <FormInput label="Vehicle Name/Model" id="name" placeholder="VAN-10" register={register} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Type" id="type" type="select" register={register}
              options={[{ value: 'Van', label: 'Van' }, { value: 'Truck', label: 'Truck' }, { value: 'Mini', label: 'Mini' }]}
            />
            <FormInput label="Capacity (kg)" id="capacity" placeholder="500" register={register} />
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
