import express from 'express';
import { 
  searchIndianMedicines, 
  getIndianSubstitutes, 
  importIndianMedicine 
} from '../controllers/externalMedicineController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

// Public Indian Medicine API endpoints
router.get('/search', searchIndianMedicines);
router.get('/substitutes', getIndianSubstitutes);

// Admin-only import endpoint
router.post('/import', protect, authorize(ROLES.ADMIN), importIndianMedicine);

export default router;
