import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, BarChart3, Clock } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: ShieldCheck,
      title: 'Role-Based Security',
      description: 'Secure, dedicated dashboards for Fleet Managers, Dispatchers, Safety Officers, and Financial Analysts.',
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Track fleet utilization, fuel efficiency, operational costs, and vehicle ROI in an intuitive interface.',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: Truck,
      title: 'Fleet & Dispatch',
      description: 'Easily manage vehicle statuses, assign trips, and handle complex dispatch logic without the headache.',
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      icon: Clock,
      title: 'Maintenance Tracking',
      description: 'Log and monitor service requests to keep your fleet in top condition and minimize unexpected downtime.',
      color: 'text-danger',
      bg: 'bg-danger/10',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary overflow-hidden font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue flex items-center justify-center shadow-glow">
            <span className="text-white font-bold text-xl tracking-tighter">T</span>
          </div>
          <span className="text-xl font-bold tracking-wide">TransitOps</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2 rounded-full border border-border hover:bg-white/5 transition-colors font-medium text-sm"
          >
            Sign In
          </button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-24 pb-32">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold mb-8 uppercase tracking-wider"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Enterprise Fleet Management
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]"
          >
            Manage Your Fleet <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue to-gold">
              Like Never Before.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="text-text-secondary text-lg md:text-xl max-w-2xl mb-12"
          >
            TransitOps is the ultimate command center for modern logistics. Coordinate drivers, track maintenance, and analyze financials all from one beautifully designed platform.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          >
            <button 
              onClick={() => navigate('/login')}
              className="group relative inline-flex items-center gap-3 bg-primary text-background font-bold text-lg px-8 py-4 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-glow"
            >
              <span className="relative z-10">Get Started</span>
              <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </button>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-8 hover:border-white/10 transition-colors group relative overflow-hidden"
            >
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-12 text-center text-text-secondary">
        <p className="text-sm">© {new Date().getFullYear()} TransitOps. All rights reserved.</p>
        <p className="text-xs mt-2 opacity-50">Built for operational excellence.</p>
      </footer>
    </div>
  );
}
