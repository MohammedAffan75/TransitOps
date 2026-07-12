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
  const Tag = type === 'select' ? 'select' : type === 'textarea' ? 'textarea' : 'input';

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          {label}{required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <Tag
        id={id}
        type={type !== 'select' && type !== 'textarea' ? type : undefined}
        placeholder={placeholder}
        defaultValue={defaultValue}
        readOnly={readOnly}
        className={`input-field ${type === 'textarea' ? 'resize-none h-24' : ''} ${error ? 'border-danger focus:border-danger focus:ring-danger/30' : ''}`}
        {...(register ? register(id) : {})}
      >
        {type === 'select' && options?.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </Tag>
      {error && <p className="text-xs text-danger">{error.message}</p>}
    </div>
  );
}
