export const money = value => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
}).format(value || 0);
export const date = value => value ? new Date(value).toLocaleDateString('en-IN') : '—';
