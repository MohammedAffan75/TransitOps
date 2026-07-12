import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import AnimatedCounter from './AnimatedCounter';

const accentConfig = {
  blue:   { border: 'border-t-blue',    text: 'text-blue',    glow: 'hover:shadow-[0_0_28px_rgba(93,169,255,0.18)]',    bar: 'bg-blue' },
  gold:   { border: 'border-t-primary', text: 'text-primary', glow: 'hover:shadow-[0_0_28px_rgba(200,135,25,0.2)]',    bar: 'bg-primary' },
  green:  { border: 'border-t-success', text: 'text-success', glow: 'hover:shadow-[0_0_28px_rgba(76,175,80,0.18)]',    bar: 'bg-success' },
  orange: { border: 'border-t-warning', text: 'text-warning', glow: 'hover:shadow-[0_0_28px_rgba(244,166,42,0.18)]',   bar: 'bg-warning' },
  danger: { border: 'border-t-danger',  text: 'text-danger',  glow: 'hover:shadow-[0_0_28px_rgba(248,113,113,0.18)]',  bar: 'bg-danger' },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.4, 0, 0.2, 1] },
  }),
};

export default function KpiCard({ label, value, accent = 'blue', icon: Icon, subtitle, index = 0 }) {
  const config = accentConfig[accent] || accentConfig.blue;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        y: -4,
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
      className={clsx(
        'kpi-card border-t-2 group transition-shadow duration-300 cursor-default',
        config.border, config.glow
      )}
    >
      <div className="flex items-start justify-between">
        <p className="section-title">{label}</p>
        {Icon && (
          <motion.div
            whileHover={{ rotate: 12, scale: 1.15 }}
            transition={{ duration: 0.2 }}
            className={clsx('p-1.5 rounded-lg bg-white/[0.04]', config.text)}
          >
            <Icon size={14} />
          </motion.div>
        )}
      </div>
      <p className={clsx('text-2xl font-bold mt-2 tabular-nums', config.text)}>
        <AnimatedCounter value={value} duration={1.1} />
      </p>
      {subtitle && <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>}

      {/* Bottom accent bar */}
      <motion.div
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: index * 0.07 + 0.3, ease: 'easeOut' }}
        className={clsx('mt-3 h-0.5 rounded-full opacity-30', config.bar)}
      />
    </motion.div>
  );
}
