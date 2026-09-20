import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure directories exist
const uploadBaseDir = path.resolve('uploads');
const prescriptionDir = path.join(uploadBaseDir, 'prescriptions');
const medicineDir = path.join(uploadBaseDir, 'medicines');

if (!fs.existsSync(uploadBaseDir)) fs.mkdirSync(uploadBaseDir, { recursive: true });
if (!fs.existsSync(prescriptionDir)) fs.mkdirSync(prescriptionDir, { recursive: true });
if (!fs.existsSync(medicineDir)) fs.mkdirSync(medicineDir, { recursive: true });

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'prescription') {
      cb(null, prescriptionDir);
    } else {
      cb(null, medicineDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// Allowed file types: JPG, JPEG, PNG, PDF
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only JPG, JPEG, PNG, and PDF files are permitted.'), false);
  }
};

export const uploadPrescription = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export const uploadMedicineImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image format. Only JPG, JPEG, PNG, and WebP are allowed.'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
