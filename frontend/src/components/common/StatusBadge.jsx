import { clsx } from 'clsx';

const statusConfig = {
  Available: { bg: 'bg-success/20', text: 'text-success', border: 'border-success/30', dot: 'bg-success' },
  'On Trip': { bg: 'bg-blue/20', text: 'text-blue', border: 'border-blue/30', dot: 'bg-blue' },
  'In Shop': { bg: 'bg-warning/20', text: 'text-warning', border: 'border-warning/30', dot: 'bg-warning' },
  Completed: { bg: 'bg-success/20', text: 'text-success', border: 'border-success/30', dot: 'bg-success' },
  Cancelled: { bg: 'bg-danger/20', text: 'text-danger', border: 'border-danger/30', dot: 'bg-danger' },
  Draft: { bg: 'bg-white/10', text: 'text-text-secondary', border: 'border-border', dot: 'bg-text-secondary' },
  Dispatched: { bg: 'bg-blue/20', text: 'text-blue', border: 'border-blue/30', dot: 'bg-blue' },
  Suspended: { bg: 'bg-warning/20', text: 'text-warning', border: 'border-warning/30', dot: 'bg-warning' },
  'Off Duty': { bg: 'bg-white/10', text: 'text-text-secondary', border: 'border-border', dot: 'bg-text-secondary' },
  Retired: { bg: 'bg-danger/20', text: 'text-danger', border: 'border-danger/30', dot: 'bg-danger' },
  Active: { bg: 'bg-warning/20', text: 'text-warning', border: 'border-warning/30', dot: 'bg-warning' },
  Pending: { bg: 'bg-primary/20', text: 'text-primary', border: 'border-primary/30', dot: 'bg-primary' },
};

export default function StatusBadge({ status, showDot = false, size = 'md' }) {
  const config = statusConfig[status] || statusConfig.Draft;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-semibold rounded-badge border',
        config.bg, config.text, config.border,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs'
      )}
    >
      {showDot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', config.dot)} />
      )}
      {status}
    </span>
  );
}
