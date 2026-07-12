import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, XCircle, Send, Info } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import FormInput from '../components/common/FormInput';
import { trips as initialTrips, vehicles, drivers } from '../data/mockData';
import { clsx } from 'clsx';

const schema = z.object({
  source: z.string().min(2, 'Source is required'),
  destination: z.string().min(2, 'Destination is required'),
  vehicleId: z.string().min(1, 'Select a vehicle'),
  driverId: z.string().min(1, 'Select a driver'),
  cargoWeight: z.coerce.number().positive('Enter valid weight'),
  distance: z.coerce.number().positive('Enter valid distance'),
});

const lifecycleSteps = ['Draft', 'Dispatched', 'Completed', 'Cancelled'];
const stepIcons = {
  Draft: Clock,
  Dispatched: Send,
  Completed: CheckCircle,
  Cancelled: XCircle,
};

const liveStatusColors = {
  Dispatched: 'bg-blue/20 text-blue border-blue/30',
  Draft: 'bg-white/10 text-text-secondary border-border',
  Cancelled: 'bg-danger/20 text-danger border-danger/30',
  'On Trip': 'bg-blue/20 text-blue border-blue/30',
};

export default function Trips() {
  const [trips, setTrips] = useState(initialTrips);
  const [currentStep, setCurrentStep] = useState(0);
  const [capacityError, setCapacityError] = useState(null);

  const availableVehicles = vehicles.filter(v => v.status === 'Available');
  const availableDrivers = drivers.filter(d => d.status === 'Available' && d.licenseStatus === 'Valid');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const watchVehicleId = watch('vehicleId');
  const watchCargoWeight = watch('cargoWeight');
  const selectedVehicle = availableVehicles.find(v => v.id === watchVehicleId);

  const onSubmit = (data) => {
    if (selectedVehicle && data.cargoWeight > selectedVehicle.capacityKg) {
      setCapacityError({
        vehicleCap: selectedVehicle.capacityKg,
        cargo: data.cargoWeight,
        excess: data.cargoWeight - selectedVehicle.capacityKg,
      });
      return;
    }
    setCapacityError(null);

    const driver = availableDrivers.find(d => d.id === data.driverId);
    const newTrip = {
      id: `TR${String(trips.length + 1).padStart(3, '0')}`,
      source: data.source,
      destination: data.destination,
      vehicleId: data.vehicleId,
      vehicleName: selectedVehicle?.name || '—',
      driverId: data.driverId,
      driverName: driver?.name || '—',
      cargoWeight: data.cargoWeight,
      distance: data.distance,
      status: 'Dispatched',
      eta: '45 min',
      dispatchedAt: new Date().toISOString(),
      completedAt: null,
      region: 'Gandhinagar',
    };
    setTrips(prev => [newTrip, ...prev]);
    setCurrentStep(1);
    reset();
    setTimeout(() => setCurrentStep(0), 3000);
  };

  const capacityExceeded = selectedVehicle && watchCargoWeight > selectedVehicle?.capacityKg;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Form */}
      <div className="space-y-5">
        {/* Trip Lifecycle Indicator */}
        <div className="card">
          <p className="section-title mb-4">Trip Lifecycle</p>
          <div className="flex items-center justify-between">
            {lifecycleSteps.map((step, i) => {
              const Icon = stepIcons[step];
              const isActive = i === currentStep;
              const isPast = i < currentStep;
              return (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-1.5">
                    <motion.div
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        backgroundColor: isActive ? '#C88719' : isPast ? '#4CAF50' : '#2A2A2A',
                      }}
                      className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-border"
                    >
                      <Icon size={14} className={isActive ? 'text-white' : isPast ? 'text-white' : 'text-text-secondary'} />
                    </motion.div>
                    <span className={clsx('text-xs font-medium', isActive ? 'text-primary' : isPast ? 'text-success' : 'text-text-secondary')}>
                      {step}
                    </span>
                  </div>
                  {i < lifecycleSteps.length - 1 && (
                    <div className={clsx('flex-1 h-0.5 mx-2 mb-4 rounded-full transition-colors duration-500', isPast ? 'bg-success' : 'bg-border')} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Create Trip Form */}
        <div className="card">
          <h2 className="text-sm font-bold text-text-primary mb-4">Create Trip</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <FormInput
              label="Source"
              id="source"
              placeholder="Gandhinagar Depot"
              register={register}
              error={errors.source}
            />
            <FormInput
              label="Destination"
              id="destination"
              placeholder="Ahmedabad Hub"
              register={register}
              error={errors.destination}
            />
            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                Vehicle (Available Only)
              </label>
              <select {...register('vehicleId')} className={`input-field ${errors.vehicleId ? 'border-danger' : ''}`}>
                <option value="">Select vehicle...</option>
                {availableVehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.name} — {v.capacity} capacity</option>
                ))}
              </select>
              {errors.vehicleId && <p className="text-xs text-danger mt-1">{errors.vehicleId.message}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                Driver (Available Only)
              </label>
              <select {...register('driverId')} className={`input-field ${errors.driverId ? 'border-danger' : ''}`}>
                <option value="">Select driver...</option>
                {availableDrivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              {errors.driverId && <p className="text-xs text-danger mt-1">{errors.driverId.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Cargo Weight (kg)"
                id="cargoWeight"
                type="number"
                placeholder="700"
                register={register}
                error={errors.cargoWeight}
              />
              <FormInput
                label="Planned Distance (km)"
                id="distance"
                type="number"
                placeholder="38"
                register={register}
                error={errors.distance}
              />
            </div>

            {/* Capacity Error */}
            <AnimatePresence>
              {capacityExceeded && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="p-3.5 bg-danger/10 border border-danger/30 rounded-card text-xs space-y-1"
                >
                  <div className="text-text-secondary">Vehicle Capacity: <span className="text-text-primary">{selectedVehicle?.capacityKg} kg</span></div>
                  <div className="text-text-secondary">Cargo Weight: <span className="text-text-primary">{watchCargoWeight} kg</span></div>
                  <div className="flex items-center gap-1.5 text-danger font-semibold">
                    <AlertTriangle size={12} />
                    Capacity exceeded by {watchCargoWeight - selectedVehicle?.capacityKg} kg — dispatch blocked
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={capacityExceeded}
                className={clsx(
                  'flex-1 py-2.5 font-semibold rounded-btn text-sm transition-all duration-200',
                  capacityExceeded
                    ? 'bg-white/10 text-text-secondary cursor-not-allowed'
                    : 'btn-primary'
                )}
              >
                {capacityExceeded ? 'Dispatch (disabled)' : 'Dispatch Trip'}
              </button>
              <button type="button" onClick={() => { reset(); setCapacityError(null); }} className="btn-secondary px-5">
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Rule info */}
        <p className="text-xs text-text-secondary flex items-center gap-1.5">
          <Info size={11} className="text-primary" />
          On Complete: odometer → fuel log → expenses → Vehicle & Driver Available
        </p>
      </div>

      {/* Right: Live Board */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-text-primary">Live Board</h2>
          <span className="text-xs text-text-secondary">{trips.length} trips</span>
        </div>
        <div className="space-y-3">
          {trips.map((trip, i) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card hover:border-border/80 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-xs font-bold text-primary">{trip.id}</span>
                  <span className="text-xs text-text-secondary ml-2">{trip.vehicleName} / {trip.driverName?.toUpperCase()}</span>
                </div>
                <span className="text-xs text-text-secondary">{trip.eta || '—'}</span>
              </div>
              <p className="text-sm font-semibold text-text-primary mb-2.5">
                {trip.source} → {trip.destination}
              </p>
              <StatusBadge status={trip.status} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
