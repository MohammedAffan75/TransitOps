import { useState } from 'react';
import { Search, Bell, X } from 'lucide-react';
import { currentUser } from '../../data/mockData';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [search, setSearch] = useState('');
  const [showNotif, setShowNotif] = useState(false);

  return (
    <header className="h-[72px] bg-sidebar border-b border-border flex items-center px-6 gap-4 flex-shrink-0">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search..."
          className="input-field pl-9 pr-8 py-2 text-sm"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white"
          >
            <X size={12} />
          </button>
        )}
      </div>

      <div className="flex-1" />

      {/* Notification Bell */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowNotif(!showNotif)}
        className="relative p-2 rounded-lg hover:bg-white/[0.06] text-text-secondary hover:text-white transition-colors"
      >
        <Bell size={18} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
      </motion.button>

      {/* Profile */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-white leading-tight">{currentUser.name}</p>
        </div>
        <div className="flex items-center gap-2 bg-blue/20 border border-blue/30 rounded-lg px-3 py-1.5">
          <span className="text-xs text-blue font-semibold">{currentUser.role}</span>
          <div className="w-6 h-6 bg-blue rounded-md flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">{currentUser.initials}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
