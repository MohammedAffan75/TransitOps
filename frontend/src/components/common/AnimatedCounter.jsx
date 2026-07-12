import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * Animates a number counting up from 0 to the target value.
 * Supports integers and decimals. Strips non-numeric suffixes like %, km/l, ₹.
 */
export default function AnimatedCounter({ value, duration = 1.2 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    // Parse the value — strip currency / units
    const raw = String(value).replace(/[₹,]/g, '').trim();
    const prefix = raw.startsWith('₹') ? '₹' : '';
    const numMatch = raw.match(/^([0-9.]+)(.*)/);
    if (!numMatch) { setDisplay(value); return; }

    const target = parseFloat(numMatch[1]);
    const suffix = numMatch[2] || '';
    const isDecimal = String(target).includes('.');
    const decimals = isDecimal ? (String(target).split('.')[1] || '').length : 0;

    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      setDisplay(
        prefix +
        (decimals > 0
          ? current.toFixed(decimals)
          : Math.round(current).toLocaleString()) +
        suffix
      );
      if (progress < 1) requestAnimationFrame(step);
      else setDisplay(prefix + (decimals > 0 ? target.toFixed(decimals) : target.toLocaleString()) + suffix);
    };
    requestAnimationFrame(step);
  }, [isInView, value, duration]);

  return <span ref={ref}>{display}</span>;
}
