import PasswordInput from './PasswordInput.jsx';
export default function FormField({
  field,
  value,
  onChange,
  error
}) {
  const {
    name,
    label,
    type = 'text',
    options = [],
    validate: _validate,
    ...rest
  } = field;
  const props = {
    id: name,
    name,
    value: value ?? '',
    onChange: e => onChange(name, e.target.value),
    'aria-invalid': !!error,
    'aria-describedby': error ? `${name}-error` : undefined,
    ...rest
  };
  return <div className="field">
  <label htmlFor={name}>
    {label}
    {field.required && <span aria-hidden="true"> *</span>}
  </label>
  {type === 'select' ? <select {...props}>
    <option value="">Select {label.toLowerCase()}</option>
    {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>
      {o.label ?? o}
    </option>)}
  </select> : type === 'textarea' ? <textarea {...props} rows="4" /> : type === 'password' ? <PasswordInput {...props} /> : <input {...props} type={type} />}
  {error && <small id={`${name}-error`} className="field-error">
    {error}
  </small>}
</div>;
}
