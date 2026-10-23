export function validate(values, fields) {
  const errors = {};
  for (const field of fields) {
    const value = values[field.name];
    if (field.required && (value === undefined || value === null || String(value).trim() === '')) errors[field.name] = `${field.label} is required`;else if (value !== '' && value !== undefined && value !== null) {
      if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors[field.name] = 'Enter a valid email';
      if (field.type === 'password' && (value.length < 8 || new TextEncoder().encode(value).length > 72)) errors[field.name] = 'Use at least 8 characters and at most 72 bytes';
      if (field.type === 'number' && (!Number.isFinite(Number(value)) || field.min !== undefined && Number(value) < field.min || field.max !== undefined && Number(value) > field.max)) errors[field.name] = `Enter a number between ${field.min ?? 0} and ${field.max ?? 'the allowed maximum'}`;
      if (field.validate) {
        const message = field.validate(value);
        if (message) errors[field.name] = message;
      }
    }
  }
  return errors;
}
