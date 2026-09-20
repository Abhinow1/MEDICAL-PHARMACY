import express from 'express';
import {
  getMedicines,
  getMedicineById,
  getCategories,
  getFeaturedMedicines,
} from '../controllers/medicineController.js';
import { searchLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/', searchLimiter, getMedicines);
router.get('/featured', getFeaturedMedicines);
router.get('/categories', getCategories);
router.get('/:id', getMedicineById);

export default router;
