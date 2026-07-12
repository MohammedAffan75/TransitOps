import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const accentConfig = {
  blue: { border: 'border-t-blue', text: 'text-blue', glow: 'shadow-[0_0_20px_rgba(93,169,255,0.1)]' },
  gold: { border: 'border-t-primary', text: 'text-primary', glow: 'shadow-[0_0_20px_rgba(200,135,25,0.1)]' },
  green: { border: 'border-t-success', text: 'text-success', glow: 'shadow-[0_0_20px_rgba(76,175,80,0.1)]' },
  orange: { border: 'border-t-warning', text: 'text-warning', glow: 'shadow-[0_0_20px_rgba(244,166,42,0.1)]' },
  danger: { border: 'border-t-danger', text: 'text-danger', glow: 'shadow-[0_0_20px_rgba(248,113,113,0.1)]' },
};

export default function KpiCard({ label, value, accent = 'blue', icon: Icon, subtitle, index = 0 }) {
  const config = accentConfig[accent] || accentConfig.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={clsx(
        'kpi-card border-t-2 group hover:scale-[1.02] transition-transform duration-200',
        config.border, config.glow
      )}
    >
      <div className="flex items-start justify-between">
        <p className="section-title">{label}</p>
        {Icon && (
          <div className={clsx('p-1.5 rounded-lg bg-white/[0.04]', config.text)}>
            <Icon size={14} />
          </div>
        )}
      </div>
      <p className={clsx('text-2xl font-bold mt-2', config.text)}>{value}</p>
      {subtitle && <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>}
    </motion.div>
  );
}
