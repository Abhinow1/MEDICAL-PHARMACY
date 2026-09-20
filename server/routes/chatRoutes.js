import express from 'express';
import { handleChatMessage } from '../controllers/chatController.js';
import { verifyToken } from '../utils/tokenUtils.js';
import User from '../models/User.js';

const router = express.Router();

// Middleware to extract user if token present, without blocking guests
const optionalAuth = async (req, res, next) => {
  let token = null;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (token) {
    try {
      const decoded = verifyToken(token);
      req.user = await User.findById(decoded.id).select('-passwordHash');
    } catch (err) {
      // Ignore token failure for optional auth
    }
  }
  next();
};

router.post('/', optionalAuth, handleChatMessage);

export default router;
