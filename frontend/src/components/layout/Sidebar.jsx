import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Truck, Users, Map, Wrench,
  Fuel, BarChart3, Settings, Zap,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard',    label: 'Dashboard',      icon: LayoutDashboard },
  { path: '/fleet',        label: 'Fleet',           icon: Truck },
  { path: '/drivers',      label: 'Drivers',         icon: Users },
  { path: '/trips',        label: 'Trips',           icon: Map },
  { path: '/maintenance',  label: 'Maintenance',     icon: Wrench },
  { path: '/fuel-expense', label: 'Fuel & Expenses', icon: Fuel },
  { path: '/analytics',    label: 'Analytics',       icon: BarChart3 },
  { path: '/settings',     label: 'Settings',        icon: Settings },
];

const sidebarVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden:  { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
};

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -260, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="w-[260px] min-h-screen bg-sidebar flex flex-col border-r border-border flex-shrink-0 theme-transition"
      style={{ boxShadow: 'var(--shadow-sidebar)' }}
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="px-5 py-5 border-b border-border"
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-glow flex-shrink-0"
          >
            <Zap size={18} className="text-white" />
          </motion.div>
          <div>
            <h1 className="text-base font-bold text-text-primary tracking-tight">TransitOps</h1>
            <p className="text-[10px] text-text-secondary">Smart Transport Platform</p>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.nav
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-none"
      >
        {navItems.map(({ path, label, icon: Icon }) => (
          <motion.div key={path} variants={itemVariants}>
            <NavLink to={path}>
              {({ isActive }) => (
                <motion.div
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className={isActive ? 'sidebar-item-active' : 'sidebar-item'}
                >
                  <motion.span
                    animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon size={17} />
                  </motion.span>
                  <span>{label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.div>
              )}
            </NavLink>
          </motion.div>
        ))}
      </motion.nav>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="px-5 py-4 border-t border-border"
      >
        <p className="text-[10px] text-text-secondary text-center">
          TRANSITOPS © 2026 · RBAC ENABLED
        </p>
      </motion.div>
    </motion.aside>
  );
}
