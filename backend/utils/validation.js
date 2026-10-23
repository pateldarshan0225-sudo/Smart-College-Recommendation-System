import mongoose from 'mongoose';
export function fail(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  throw error;
}
export const ok = (res, data = null, message = 'Success', status = 200) => res.status(status).json({
  success: true,
  message,
  data
});
export function text(value, label, {
  required = true,
  max = 2000
} = {}) {
  if (typeof value !== 'string') {
    if (!required && (value === undefined || value === null)) return '';
    fail(`${label} must be text`);
  }
  const result = value.trim();
  if (required && !result || result.length > max) fail(`${label} is required and must be at most ${max} characters`);
  return result;
}
export function number(value, label, min = 0, max = Number.MAX_SAFE_INTEGER) {
  if (value === '' || value === null || value === undefined || !['number', 'string'].includes(typeof value)) fail(`${label} is required`);
  const n = Number(value);
  if (!Number.isFinite(n) || n < min || n > max) fail(`${label} must be between ${min} and ${max}`);
  return n;
}
export function id(value, label, optional = false) {
  if (optional && !value) return null;
  if (typeof value !== 'string' || !mongoose.isValidObjectId(value)) fail(`${label} is invalid`);
  return value;
}
export function email(value) {
  const result = text(value, 'Email', {
    max: 254
  }).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result)) fail('Enter a valid email');
  return result;
}
export function password(value) {
  if (typeof value !== 'string' || value.length < 8 || Buffer.byteLength(value) > 72) fail('Password must be at least 8 characters and at most 72 bytes');
  return value;
}
export function url(value, label) {
  const result = text(value, label, {
    required: false,
    max: 2000
  });
  if (result) {
    try {
      const parsed = new URL(result);
      if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname || parsed.username || parsed.password) fail(`${label} must be an HTTP or HTTPS URL without credentials`);
    } catch {
      fail(`${label} must be an HTTP or HTTPS URL without credentials`);
    }
  }
  return result;
}
export async function reference(Model, value, label, filter = {}) {
  if (value && !(await Model.exists({
    ...filter,
    _id: value
  }))) fail(`${label} does not exist`);
}
