import express from 'express';
import {
  uploadPrescriptionFile,
  getMyPrescriptions,
  getPrescriptionById,
} from '../controllers/prescriptionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadPrescription } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/upload', uploadPrescription.single('prescription'), uploadPrescriptionFile);
router.get('/my', getMyPrescriptions);
router.get('/:id', getPrescriptionById);

export default router;
