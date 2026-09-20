import Medicine from '../models/Medicine.js';
import Category from '../models/Category.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getMedicines = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
      prescriptionRequired,
      sort = 'popularity',
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isActive: true };

    // Search query: matching name, genericName, brand, description or uses
    if (search && search.trim() !== '') {
      const term = search.trim();
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { genericName: { $regex: term, $options: 'i' } },
        { brand: { $regex: term, $options: 'i' } },
        { uses: { $regex: term, $options: 'i' } },
      ];
    }

    // Category filter by category slug or ObjectId
    if (category && category !== 'all') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat) {
          query.category = cat._id;
        }
      }
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Availability filter
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Prescription required filter
    if (prescriptionRequired !== undefined && prescriptionRequired !== '') {
      query.prescriptionRequired = prescriptionRequired === 'true';
    }

    // Sorting
    let sortOptions = {};
    if (sort === 'price-asc') sortOptions = { price: 1 };
    else if (sort === 'price-desc') sortOptions = { price: -1 };
    else if (sort === 'name-asc') sortOptions = { name: 1 };
    else if (sort === 'name-desc') sortOptions = { name: -1 };
    else if (sort === 'discount') sortOptions = { discount: -1 };
    else sortOptions = { createdAt: -1 }; // popularity / newest

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const totalMedicines = await Medicine.countDocuments(query);
    const medicines = await Medicine.find(query)
      .populate('category', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    return sendSuccess(res, {
      medicines,
      pagination: {
        total: totalMedicines,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalMedicines / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMedicineById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findById(id).populate('category', 'name slug');

    if (!medicine || !medicine.isActive) {
      return sendError(res, 'Medicine not found', 404);
    }

    // Get related medicines in same category
    const related = await Medicine.find({
      category: medicine.category?._id,
      _id: { $ne: medicine._id },
      isActive: true,
    })
      .limit(4)
      .select('name brand genericName price discount stock prescriptionRequired image');

    return sendSuccess(res, {
      medicine,
      related,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    return sendSuccess(res, { categories });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedMedicines = async (req, res, next) => {
  try {
    const popularMedicines = await Medicine.find({ isActive: true, stock: { $gt: 0 } })
      .populate('category', 'name slug')
      .sort({ discount: -1, createdAt: -1 })
      .limit(8);

    return sendSuccess(res, { medicines: popularMedicines });
  } catch (error) {
    next(error);
  }
};
