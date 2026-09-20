import express from 'express';
import {
  register,
  login,
  adminLogin,
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/admin-login', authLimiter, adminLogin);

// Protected user routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/address', protect, addAddress);
router.put('/address/:addressId', protect, updateAddress);
router.delete('/address/:addressId', protect, deleteAddress);

export default router;
