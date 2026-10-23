export default function errorMiddleware(error, req, res, next) {
  if (res.headersSent) return next(error);
  let status = error.status || 500;
  let message = error.message;
  if (error.code === 11000) {
    status = 409;
    message = 'This record already exists';
  }
  if (error.name === 'ValidationError' || error.name === 'CastError' || error.type === 'entity.parse.failed') {
    status = 400;
    message = error.name === 'ValidationError' ? Object.values(error.errors).map(e => e.message).join(', ') : 'Invalid request data';
  }
  if (status === 500) {
    console.error('Request failed:', error.name);
    message = 'An unexpected server error occurred';
  }
  res.status(status).json({
    success: false,
    message,
    data: null
  });
}
