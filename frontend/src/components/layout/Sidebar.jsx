import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Truck,
  Users,
  Map,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
  Zap,
  LogOut,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/fleet', label: 'Fleet', icon: Truck },
  { path: '/drivers', label: 'Drivers', icon: Users },
  { path: '/trips', label: 'Trips', icon: Map },
  { path: '/maintenance', label: 'Maintenance', icon: Wrench },
  { path: '/fuel-expense', label: 'Fuel & Expenses', icon: Fuel },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-[260px] min-h-screen bg-sidebar flex flex-col border-r border-border flex-shrink-0 theme-transition"
      style={{ boxShadow: 'var(--shadow-sidebar)' }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-glow flex-shrink-0">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-text-primary tracking-tight">TransitOps</h1>
            <p className="text-[10px] text-text-secondary">Smart Transport Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-none">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink key={path} to={path}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
                className={isActive ? 'sidebar-item-active' : 'sidebar-item'}
              >
                <Icon size={17} />
                <span>{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60"
                  />
                )}
              </motion.div>
            )}
          </NavLink>
        ))}

        {/* Logout */}
        <motion.button
          whileHover={{ x: 2 }}
          transition={{ duration: 0.15 }}
          onClick={() => navigate('/login')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-danger/80 hover:text-danger hover:bg-danger/10 transition-all duration-200 cursor-pointer text-sm font-medium mt-2"
        >
          <LogOut size={17} />
          <span>Logout</span>
        </motion.button>
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-border">
        <p className="text-[10px] text-text-secondary text-center">
          TRANSITOPS © 2026 · RBAC ENABLED
        </p>
      </div>
    </motion.aside>
  );
}

