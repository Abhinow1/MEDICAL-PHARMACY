import { verifyToken } from '../utils/tokenUtils.js';
import User from '../models/User.js';
import { sendError } from '../utils/apiResponse.js';

export const protect = async (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 'Authentication required. No token provided.', 401);
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return sendError(res, 'User no longer exists.', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'This account has been deactivated. Please contact support.', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Invalid or expired token.', 401);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(res, 'Forbidden: You do not have permission to access this resource.', 403);
    }
    next();
  };
};
