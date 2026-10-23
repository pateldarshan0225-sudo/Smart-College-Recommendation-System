import User from '../models/User.js';
import Admin from '../models/Admin.js';
function requireRole(role) {
  return async (req, res, next) => {
    if (!req.session.identity) return res.status(401).json({
      success: false,
      message: 'Please log in',
      data: null
    });
    if (req.session.identity.role !== role) return res.status(403).json({
      success: false,
      message: 'This role cannot access this resource',
      data: null
    });
    // Recheck existence so an administrator-deleted account cannot keep using its session.
    const Model = role === 'admin' ? Admin : User;
    if (!(await Model.exists({
      ...(role === 'user' ? { isActive: { $ne: false } } : {}),
      _id: req.session.identity.id
    }))) {
      await new Promise(resolve => req.session.destroy(resolve));
      return res.status(401).json({
        success: false,
        message: 'Account is inactive or no longer exists',
        data: null
      });
    }
    next();
  };
}
export const isUser = requireRole('user');
export const isAdmin = requireRole('admin');
