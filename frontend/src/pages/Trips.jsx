import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, XCircle, Send, Info, RefreshCw } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import FormInput from '../components/common/FormInput';
import { clsx } from 'clsx';
import api from '../utils/api';

const schema = z.object({
  source: z.string().min(2, 'Source is required'),
  destination: z.string().min(2, 'Destination is required'),
  vehicleId: z.string().min(1, 'Select a vehicle'),
  driverId: z.string().min(1, 'Select a driver'),
  cargoWeight: z.coerce.number().positive('Enter valid weight'),
  distance: z.coerce.number().positive('Enter valid distance'),
  revenue: z.coerce.number().optional(),
});

const statusLabel = { DRAFT: 'Draft', DISPATCHED: 'Dispatched', COMPLETED: 'Completed', CANCELLED: 'Cancelled' };
const stepIcons = { Draft: Clock, Dispatched: Send, Completed: CheckCircle, Cancelled: XCircle };
const stepColors = {
  DRAFT: 'bg-white/10 text-text-secondary border-border',
  DISPATCHED: 'bg-blue/20 text-blue border-blue/30',
  COMPLETED: 'bg-success/20 text-success border-success/30',
  CANCELLED: 'bg-danger/20 text-danger border-danger/30',
};

export default function Trips() {
  const [trips, setTrips]                   = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [availableDrivers, setAvailableDrivers]   = useState([]);
  const [loading, setLoading]               = useState(true);
  const [submitting, setSubmitting]         = useState(false);
  const [capacityError, setCapacityError]   = useState(null);
  const [actionMsg, setActionMsg]           = useState(null);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const watchVehicleId  = watch('vehicleId');
  const watchCargoWeight = watch('cargoWeight');
  const selectedVehicle = availableVehicles.find(v => String(v.id) === String(watchVehicleId));

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [tripsRes, vehiclesRes, driversRes] = await Promise.all([
        api.get('/trips'),
        api.get('/vehicles/dispatchable'),
        api.get('/drivers/dispatchable'),
      ]);
      setTrips(tripsRes.data || tripsRes);
      setAvailableVehicles(vehiclesRes.data || vehiclesRes);
      setAvailableDrivers(driversRes.data || driversRes);
    } catch (e) {
      console.error('Failed to load trips data:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const flash = (msg, isError = false) => {
    setActionMsg({ text: msg, error: isError });
    setTimeout(() => setActionMsg(null), 3000);
  };

  const onSubmit = async (data) => {
    if (selectedVehicle && data.cargoWeight > Number(selectedVehicle.capacity)) {
      setCapacityError({ vehicleCap: selectedVehicle.capacity, cargo: data.cargoWeight });
      return;
    }
    setCapacityError(null);
    setSubmitting(true);
    try {
      await api.post('/trips', {
        source: data.source,
        destination: data.destination,
        vehicleId: Number(data.vehicleId),
        driverId: Number(data.driverId),
        cargoWeight: data.cargoWeight,
        distance: data.distance,
        revenue: data.revenue || null,
      });
      reset();
      await fetchAll();
      flash('✅ Draft trip created successfully!');
    } catch (e) {
      flash(e.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAction = async (trip, action) => {
    try {
      await api.post(`/trips/${trip.id}/${action}`);
      await fetchAll();
      flash(`✅ Trip ${action}ed successfully!`);
    } catch (e) {
      flash(e.message, true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Flash message */}
      <AnimatePresence>
        {actionMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={clsx('p-3 rounded-card text-sm font-medium border', actionMsg.error
              ? 'bg-danger/10 text-danger border-danger/30'
              : 'bg-success/10 text-success border-success/30'
            )}
          >
            {actionMsg.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Dispatch Form ── */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 card">
          <h2 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
            <Send size={15} className="text-primary" /> Create & Dispatch Trip
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <FormInput label="Source" id="source" placeholder="Gandhinagar Depot" register={register} error={errors.source?.message} />
            <FormInput label="Destination" id="destination" placeholder="Ahmedabad Warehouse" register={register} error={errors.destination?.message} />

            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">Vehicle</label>
              <select {...register('vehicleId')} className="input-field w-full text-sm">
                <option value="">— Select Vehicle —</option>
                {availableVehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.model} ({v.registrationNumber}) — {Number(v.capacity).toLocaleString()} kg</option>
                ))}
              </select>
              {errors.vehicleId && <p className="text-xs text-danger mt-1">{errors.vehicleId.message}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">Driver</label>
              <select {...register('driverId')} className="input-field w-full text-sm">
                <option value="">— Select Driver —</option>
                {availableDrivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name} — {d.licenseCategory}</option>
                ))}
              </select>
              {errors.driverId && <p className="text-xs text-danger mt-1">{errors.driverId.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Cargo (kg)" id="cargoWeight" type="number" placeholder="1000" register={register} error={errors.cargoWeight?.message} />
              <FormInput label="Distance (km)" id="distance" type="number" placeholder="50" register={register} error={errors.distance?.message} />
            </div>
            <FormInput label="Revenue (₹) optional" id="revenue" type="number" placeholder="15000" register={register} />

            {/* Capacity error */}
            <AnimatePresence>
              {capacityError && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="p-3 bg-danger/10 border border-danger/30 rounded-card flex items-center gap-2"
                >
                  <AlertTriangle size={14} className="text-danger flex-shrink-0" />
                  <p className="text-xs text-danger">
                    Cargo <strong>{Number(capacityError.cargo).toLocaleString()} kg</strong> exceeds vehicle capacity of <strong>{Number(capacityError.vehicleCap).toLocaleString()} kg</strong>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
              <Send size={14} /> {submitting ? 'Creating...' : 'Create Draft Trip'}
            </button>
          </form>
          <div className="mt-3 flex items-center gap-2 text-xs text-primary">
            <Info size={11} /> Draft trips must be dispatched separately — use the action buttons on the right.
          </div>
        </motion.div>

        {/* ── Trip List ── */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-text-primary">All Trips ({trips.length})</h2>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={fetchAll} className="btn-secondary flex items-center gap-1.5 text-xs">
              <RefreshCw size={12} /> Refresh
            </motion.button>
          </div>

          {loading && <div className="text-center py-8 text-text-secondary text-sm">Loading trips…</div>}

          {!loading && trips.map((trip, i) => {
            const friendly = statusLabel[trip.status] || trip.status;
            const Icon = stepIcons[friendly] || Clock;
            return (
              <motion.div key={trip.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-text-primary text-sm">#{trip.id}</span>
                      <span className={clsx('px-2 py-0.5 text-xs font-semibold rounded-badge border', stepColors[trip.status])}>
                        <Icon size={10} className="inline mr-1" />{friendly}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary truncate">
                      {trip.source} → {trip.destination}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Vehicle: <span className="text-text-primary">{trip.vehicle?.model || '—'}</span> &nbsp;·&nbsp;
                      Driver: <span className="text-text-primary">{trip.driver?.name || '—'}</span>
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Cargo: {Number(trip.cargoWeight).toLocaleString()} kg &nbsp;·&nbsp;
                      {Number(trip.distance)} km
                      {trip.revenue && <> &nbsp;·&nbsp; ₹{Number(trip.revenue).toLocaleString()}</>}
                    </p>
                  </div>
                  {/* Action buttons */}
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    {trip.status === 'DRAFT' && (
                      <button onClick={() => handleAction(trip, 'dispatch')} className="px-3 py-1 text-xs font-semibold rounded-badge bg-blue/20 text-blue border border-blue/30 hover:bg-blue/30 transition-all">
                        Dispatch
                      </button>
                    )}
                    {trip.status === 'DISPATCHED' && (
                      <button onClick={() => handleAction(trip, 'complete')} className="px-3 py-1 text-xs font-semibold rounded-badge bg-success/20 text-success border border-success/30 hover:bg-success/30 transition-all">
                        Complete
                      </button>
                    )}
                    {(trip.status === 'DRAFT' || trip.status === 'DISPATCHED') && (
                      <button onClick={() => handleAction(trip, 'cancel')} className="px-3 py-1 text-xs font-semibold rounded-badge bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 transition-all">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {!loading && trips.length === 0 && (
            <div className="text-center py-12 text-text-secondary text-sm">No trips yet. Create one using the form.</div>
          )}
        </div>
      </div>
    </div>
  );
}
