export default function FormInput({
  label,
  id,
  type = 'text',
  placeholder,
  register,
  error,
  required,
  options,
  className = '',
  readOnly = false,
  defaultValue,
}) {
  const registration = register ? register(id) : {};

  const sharedProps = {
    id,
    placeholder,
    defaultValue,
    readOnly,
    className: `input-field ${type === 'textarea' ? 'resize-none h-24' : ''} ${error ? 'border-danger focus:border-danger focus:ring-danger/30' : ''}`,
    ...registration,
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          {label}{required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}

      {type === 'select' ? (
        <select {...sharedProps}>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea {...sharedProps} />
      ) : (
        <input type={type} {...sharedProps} />
      )}

      {error && <p className="text-xs text-danger">{error.message}</p>}
    </div>
  );
}

