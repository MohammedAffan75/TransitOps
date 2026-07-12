import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, AlertCircle, Zap, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const schema = z.object({
  email:      z.string().email('Invalid email address'),
  password:   z.string().min(6, 'Password must be at least 6 characters'),
  role:       z.string().min(1, 'Please select a role'),
  rememberMe: z.boolean().optional(),
});

const roles = ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'];
const roleAccess = [
  { role: 'Fleet Manager',    access: 'Fleet, Maintenance' },
  { role: 'Dispatcher',       access: 'Dashboard, Trips' },
  { role: 'Safety Officer',   access: 'Drivers, Compliance' },
  { role: 'Financial Analyst',access: 'Fuel & Expenses, Analytics' },
];

// Floating particles background
const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1.5,
  duration: Math.random() * 10 + 12,
  delay: Math.random() * 5,
}));

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export default function Login() {
  const navigate = useNavigate();
  const [showPass, setShowPass]   = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'Dispatcher' },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError(false);
    await new Promise(r => setTimeout(r, 900));
    if (data.email === 'wrong@test.com') {
      setLoginError(true);
      setIsLoading(false);
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-background overflow-hidden">

      {/* ── Left branding panel ── */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="w-[38%] bg-sidebar border-r border-border flex flex-col justify-between p-10 relative overflow-hidden"
      >
        {/* Floating particles */}
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-primary/20 pointer-events-none"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            animate={{
              y: [0, -30, 0],
              x: [0, 10, -10, 0],
              opacity: [0.15, 0.45, 0.15],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #C88719 1px, transparent 0)`,
            backgroundSize: '28px 28px',
          }}
        />

        {/* Glow blob */}
        <motion.div
          className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10"
        >
          {/* Logo */}
          <motion.div variants={itemVariants} className="mb-8">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-glow inline-flex"
            >
              <Zap size={22} className="text-white" />
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold text-text-primary mb-1">TransitOps</h1>
            <p className="text-text-secondary text-sm">Smart Transport Operations Platform</p>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-12">
            <p className="text-sm font-semibold text-text-primary mb-4">One login, four roles:</p>
            <div className="space-y-2.5">
              {roles.map((role, i) => (
                <motion.div
                  key={role}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.09, duration: 0.35 }}
                  className="flex items-center gap-2.5 group"
                >
                  <motion.span
                    whileHover={{ scale: 1.4 }}
                    className="w-2 h-2 rounded-full bg-primary flex-shrink-0"
                  />
                  <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors duration-200">
                    {role}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="relative z-10"
        >
          <p className="text-[11px] text-text-secondary/50">TRANSITOPS © 2026 · RBAC ENABLED</p>
        </motion.div>
      </motion.div>

      {/* ── Right login form ── */}
      <div className="flex-1 flex items-center justify-center p-10 relative">

        {/* Subtle background glow */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-md relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-text-primary mb-1">Sign in to your account</h2>
            <p className="text-sm text-text-secondary">Enter your credentials to continue</p>
          </motion.div>

          {/* Error alert */}
          <AnimatePresence>
            {loginError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="mb-5 p-3.5 bg-danger/10 border border-danger/30 rounded-card flex items-start gap-2.5"
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <AlertCircle size={16} className="text-danger flex-shrink-0 mt-0.5" />
                </motion.div>
                <div>
                  <p className="text-sm font-semibold text-danger">Invalid credentials.</p>
                  <p className="text-xs text-danger/80 mt-0.5">Account locked after 5 failed attempts.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Email */}
            <motion.div variants={itemVariants}>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">Email</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.15 }}
                {...register('email')}
                type="email"
                placeholder="raven.k@transitops.in"
                className={`input-field ${errors.email ? 'border-danger' : ''}`}
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-danger mt-1"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">Password</label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.15 }}
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`input-field pr-10 ${errors.password ? 'border-danger' : ''}`}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </motion.button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-danger mt-1"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </motion.div>

            {/* Role */}
            <motion.div variants={itemVariants}>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">Role (RBAC)</label>
              <div className="relative">
                <select {...register('role')} className="input-field appearance-none pr-8">
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
              </div>
            </motion.div>

            {/* Remember me */}
            <motion.div variants={itemVariants} className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  {...register('rememberMe')}
                  type="checkbox"
                  className="w-4 h-4 rounded border-border bg-background accent-primary cursor-pointer"
                />
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">Remember me</span>
              </label>
              <motion.button
                type="button"
                whileHover={{ x: 2 }}
                className="text-sm text-primary hover:text-primary-light transition-colors"
              >
                Forgot password?
              </motion.button>
            </motion.div>

            {/* Submit */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.01, boxShadow: '0 0 24px rgba(200,135,25,0.35)' }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isLoading ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Signing in...
                    </motion.span>
                  ) : (
                    <motion.span
                      key="signin"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Sign In
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </motion.form>

          {/* Role access info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-6 p-4 bg-white/[0.03] border border-border rounded-card"
          >
            <p className="text-xs text-text-secondary mb-2 font-semibold">Access is scoped by role after login:</p>
            <div className="space-y-1">
              {roleAccess.map(({ role, access }, i) => (
                <motion.p
                  key={role}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + i * 0.06 }}
                  className="text-xs text-text-secondary"
                >
                  • <span className="text-text-primary/70">{role}</span> → {access}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
