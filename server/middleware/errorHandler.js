export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  if (err?.code === 11000) return res.status(409).json({ success: false, message: 'Duplicate value already exists', details: err.keyValue });
  if (err?.name === 'ValidationError') return res.status(400).json({ success: false, message: 'Validation failed', details: Object.values(err.errors).map(e => e.message) });
  if (err?.name === 'CastError') return res.status(400).json({ success: false, message: 'Invalid ID or value' });
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
}
