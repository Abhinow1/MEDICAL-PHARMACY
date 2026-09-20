import indianMedicineService from '../services/indianMedicineService.js';
import Medicine from '../models/Medicine.js';
import Category from '../models/Category.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * @desc Search Indian Medicine Database (Brands, Salts, Manufacturers)
 * @route GET /api/external-medicines/search
 * @access Public
 */
export const searchIndianMedicines = async (req, res, next) => {
  try {
    const { query = '', limit = 20 } = req.query;
    const results = indianMedicineService.searchMedicines(query, parseInt(limit, 10));

    return sendSuccess(res, {
      total: results.length,
      medicines: results,
    }, 'Indian medicines retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Find affordable Indian generic substitutes for active salt
 * @route GET /api/external-medicines/substitutes
 * @access Public
 */
export const getIndianSubstitutes = async (req, res, next) => {
  try {
    const { generic } = req.query;

    if (!generic) {
      return sendError(res, 'Please provide generic name or brand to find substitutes', 400);
    }

    const substitutes = indianMedicineService.findSubstitutes(generic);

    return sendSuccess(res, {
      count: substitutes.length,
      query: generic,
      substitutes,
    }, 'Substitutes fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Import medicine from Indian drug index into active store catalog
 * @route POST /api/external-medicines/import
 * @access Admin only
 */
export const importIndianMedicine = async (req, res, next) => {
  try {
    const { brandName, categorySlug = 'pain-relief', initialStock = 100 } = req.body;

    const drug = indianMedicineService.getMedicineDetails(brandName);
    if (!drug) {
      return sendError(res, 'Medicine not found in Indian Drug Directory', 404);
    }

    let category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      category = await Category.findOne(); // fallback to first category
    }

    // Check if already in inventory
    let existing = await Medicine.findOne({ name: drug.brandName });
    if (existing) {
      return sendSuccess(res, { medicine: existing }, 'Medicine already exists in store inventory');
    }

    const costPrice = Math.round(drug.mrp * 0.65);

    const newMed = await Medicine.create({
      name: drug.brandName,
      genericName: drug.genericComposition,
      brand: drug.manufacturer,
      category: category._id,
      description: `Official ${drug.brandName} manufactured by ${drug.manufacturer}. Therapeutic class: ${drug.therapeuticClass}. Contains ${drug.genericComposition}. Manufactured in compliance with CDSCO regulatory guidelines.`,
      uses: [drug.therapeuticClass],
      price: Math.round(drug.mrp),
      costPrice: costPrice,
      discount: 10,
      stock: parseInt(initialStock, 10) || 50,
      lowStockThreshold: 15,
      prescriptionRequired: drug.prescriptionRequired,
      dosageForm: drug.dosageForm,
      strength: drug.packSize,
      packSize: drug.packSize,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
      isActive: true,
    });

    return sendSuccess(res, { medicine: newMed }, 'Medicine successfully imported into store catalog', 201);
  } catch (error) {
    next(error);
  }
};
