export function Field({ label, children }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function TextInput({ value = '', onChange, type = 'text', required = false, placeholder = '' }) {
  return <input type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} placeholder={placeholder} />;
}

export function TextArea({ value = '', onChange }) {
  return <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} />;
}

export function SelectInput({ value = '', onChange, options, required = false }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} required={required}>
      <option value="">Seleccionar</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
}

export function MultiCheckbox({ options, values = [], onChange }) {
  function toggle(value) {
    onChange(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  }

  return (
    <div className="admin-check-grid">
      {options.map((option) => (
        <label key={option.value}>
          <input type="checkbox" checked={values.includes(option.value)} onChange={() => toggle(option.value)} />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}
