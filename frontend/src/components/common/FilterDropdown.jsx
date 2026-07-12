import { ChevronDown } from 'lucide-react';

export default function FilterDropdown({ label, value, options, onChange, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input-field pr-8 appearance-none cursor-pointer"
      >
        <option value="all">{label}: All</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
      />
    </div>
  );
}
