import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, AlertCircle, Zap, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().min(1, 'Please select a role'),
  rememberMe: z.boolean().optional(),
});

const roles = ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'];

const roleAccess = [
  { role: 'Fleet Manager', access: 'Fleet, Maintenance' },
  { role: 'Dispatcher', access: 'Dashboard, Trips' },
  { role: 'Safety Officer', access: 'Drivers, Compliance' },
  { role: 'Financial Analyst', access: 'Fuel & Expenses, Analytics' },
];

export default function Login() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'Dispatcher' },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError(false);
    await new Promise(r => setTimeout(r, 800));
    // Simulate wrong credentials for demo
    if (data.email === 'wrong@test.com') {
      setLoginError(true);
      setIsLoading(false);
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left branding panel */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-[38%] bg-[#1a1a1a] border-r border-border flex flex-col justify-between p-10 relative overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #C88719 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-glow">
              <Zap size={22} className="text-white" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-bold text-white mb-1">TransitOps</h1>
            <p className="text-text-secondary text-sm">Smart Transport Operations Platform</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-12"
          >
            <p className="text-sm font-semibold text-white mb-4">One login, four roles:</p>
            <div className="space-y-2.5">
              {roles.map((role, i) => (
                <motion.div
                  key={role}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-center gap-2.5"
                >
                  <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-sm text-text-secondary">{role}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10"
        >
          <p className="text-[11px] text-text-secondary/50">TRANSITOPS © 2026 · RBAC ENABLED</p>
        </motion.div>
      </motion.div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">Sign in to your account</h2>
            <p className="text-sm text-text-secondary">Enter your credentials to continue</p>
          </div>

          {/* Error alert */}
          <AnimatePresence>
            {loginError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-5 p-3.5 bg-danger/10 border border-danger/30 rounded-card flex items-start gap-2.5"
              >
                <AlertCircle size={16} className="text-danger flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-danger">Invalid credentials.</p>
                  <p className="text-xs text-danger/80 mt-0.5">Account locked after 5 failed attempts.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="raven.k@transitops.in"
                className={`input-field ${errors.email ? 'border-danger' : ''}`}
              />
              {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`input-field pr-10 ${errors.password ? 'border-danger' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">Role (RBAC)</label>
              <div className="relative">
                <select
                  {...register('role')}
                  className="input-field appearance-none pr-8"
                >
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
              </div>
            </div>

            {/* Remember me & Forgot */}
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  {...register('rememberMe')}
                  type="checkbox"
                  className="w-4 h-4 rounded border-border bg-background accent-primary cursor-pointer"
                />
                <span className="text-sm text-text-secondary group-hover:text-white transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-sm text-primary hover:text-primary-light transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : 'Sign In'}
            </motion.button>
          </form>

          {/* Role access info */}
          <div className="mt-6 p-4 bg-white/[0.03] border border-border rounded-card">
            <p className="text-xs text-text-secondary mb-2 font-semibold">Access is scoped by role after login:</p>
            <div className="space-y-1">
              {roleAccess.map(({ role, access }) => (
                <p key={role} className="text-xs text-text-secondary">
                  • <span className="text-white/70">{role}</span> → {access}
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
