import { PackageSearch } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmptyState({ title = 'No data found', description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 gap-3 text-center"
    >
      <div className="p-4 bg-white/[0.04] rounded-full">
        <PackageSearch size={32} className="text-text-secondary" />
      </div>
      <div>
        <p className="text-base font-semibold text-white">{title}</p>
        {description && <p className="text-sm text-text-secondary mt-1">{description}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  );
}
