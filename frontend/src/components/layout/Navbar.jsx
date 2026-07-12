import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';

/** Safely read the logged-in user from localStorage. Falls back to a guest object. */
function getStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    if (!raw || raw === 'undefined' || raw === 'null') return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function formatRole(roleStr = '') {
  return roleStr.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function getInitials(name = '') {
  return name.split(' ').map(n => n[0] || '').join('').toUpperCase().substring(0, 2) || '??';
}

export default function Navbar() {
  const [search, setSearch] = useState('');
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const storedUser = getStoredUser();
  const user = storedUser
    ? { name: storedUser.name, role: formatRole(storedUser.role), initials: getInitials(storedUser.name) }
    : { name: 'Guest', role: 'Dispatcher', initials: 'GU' };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="h-[72px] bg-sidebar border-b border-border flex items-center px-6 gap-4 flex-shrink-0 theme-transition">
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
          >
            <X size={12} />
          </button>
        )}
      </div>

      <div className="flex-1" />



      {/* Theme Toggle */}
      <motion.button
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9, rotate: 15 }}
        className="relative p-2 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-primary transition-all duration-200 overflow-hidden bg-card"
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span key="sun" initial={{ opacity: 0, rotate: -90, scale: 0.5 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 90, scale: 0.5 }} transition={{ duration: 0.2 }} className="flex items-center justify-center text-warning">
              <Sun size={17} />
            </motion.span>
          ) : (
            <motion.span key="moon" initial={{ opacity: 0, rotate: 90, scale: 0.5 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: -90, scale: 0.5 }} transition={{ duration: 0.2 }} className="flex items-center justify-center text-blue">
              <Moon size={17} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Profile Badge */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-text-primary leading-tight">{user.name}</p>
        </div>
        <div className="flex items-center gap-2 bg-blue/20 border border-blue/30 rounded-lg px-3 py-1.5">
          <span className="text-xs text-blue font-semibold">{user.role}</span>
          <div className="w-6 h-6 bg-blue rounded-md flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">{user.initials}</span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <motion.button
        onClick={handleLogout}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-danger/10 hover:bg-danger/20 border border-danger/30 text-danger text-xs font-semibold transition-all duration-200"
        title="Log Out"
      >
        <LogOut size={15} />
        <span className="hidden sm:inline">Logout</span>
      </motion.button>
    </header>
  );
}
