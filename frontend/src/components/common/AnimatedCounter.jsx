import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * Animates a number counting up from 0 to the target value cleanly.
 * Supports integers, decimals, currency symbols, and zero-padded strings without losing formatting.
 */
export default function AnimatedCounter({ value, duration = 1.2 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    const strVal = String(value);
    const hasRupee = strVal.includes('₹');
    const cleaned = strVal.replace(/[₹,]/g, '').trim();
    const numMatch = cleaned.match(/^([0-9.]+)(.*)/);
    if (!numMatch) { setDisplay(strVal); return; }

    const target = parseFloat(numMatch[1]);
    const suffix = numMatch[2] || '';
    const isDecimal = String(target).includes('.');
    const decimals = isDecimal ? (String(target).split('.')[1] || '').length : 0;
    const isPadded = !isDecimal && numMatch[1].startsWith('0') && numMatch[1].length > 1;

    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      let formatted = decimals > 0
        ? current.toFixed(decimals)
        : Math.round(current).toLocaleString();

      if (isPadded) {
        formatted = String(Math.round(current)).padStart(numMatch[1].length, '0');
      }

      setDisplay((hasRupee ? '₹' : '') + formatted + suffix);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplay(strVal);
      }
    };
    requestAnimationFrame(step);
  }, [isInView, value, duration]);

  return <span ref={ref}>{display}</span>;
}
