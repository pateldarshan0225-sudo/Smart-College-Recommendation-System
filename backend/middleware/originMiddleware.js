export default function originMiddleware(req, res, next) {
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && req.get('origin') !== process.env.CLIENT_URL) return res.status(403).json({
    success: false,
    message: 'Request origin is not allowed',
    data: null
  });
  next();
}
