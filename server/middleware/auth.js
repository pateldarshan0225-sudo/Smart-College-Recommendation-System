import { verifyAccessToken } from '../utils/tokens.js';
import User from '../models/User.js';

export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, message: 'Access token required' });
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select('-password');
    if (!user || user.status !== 'active') return res.status(401).json({ success: false, message: 'User is not active' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired access token' });
  }
}

export function authorizeAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required' });
  next();
}

export function authorizeUser(req, res, next) {
  if (req.user?.role !== 'user') return res.status(403).json({ success: false, message: 'User access required' });
  next();
}
