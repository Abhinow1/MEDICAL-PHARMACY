import Medicine from '../models/Medicine.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Prescription from '../models/Prescription.js';
import InventoryTransaction from '../models/InventoryTransaction.js';
import analyticsService from '../services/analyticsService.js';
import inventoryService from '../services/inventoryService.js';
import auditService from '../services/auditService.js';
import notificationService from '../services/notificationService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { ORDER_STATUS, PRESCRIPTION_STATUS, ROLES } from '../config/constants.js';

// --- Analytics Endpoints ---

export const getAnalyticsOverview = async (req, res, next) => {
  try {
    const overview = await analyticsService.getOverview();
    return sendSuccess(res, overview);
  } catch (error) {
    next(error);
  }
};

export const getSalesTrend = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days, 10) || 30;
    const trend = await analyticsService.getSalesTrend(days);
    return sendSuccess(res, { trend });
  } catch (error) {
    next(error);
  }
};

export const getTopProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const topProducts = await analyticsService.getTopSellingProducts(limit);
    return sendSuccess(res, { topProducts });
  } catch (error) {
    next(error);
  }
};

export const getCategoryAnalytics = async (req, res, next) => {
  try {
    const categories = await analyticsService.getCategorySales();
    return sendSuccess(res, { categories });
  } catch (error) {
    next(error);
  }
};

// --- Medicine Management ---

export const getAdminMedicines = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search && search.trim() !== '') {
      const term = search.trim();
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { genericName: { $regex: term, $options: 'i' } },
        { brand: { $regex: term, $options: 'i' } },
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Medicine.countDocuments(query);
    const medicines = await Medicine.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return sendSuccess(res, {
      medicines,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createMedicine = async (req, res, next) => {
  try {
    const {
      name,
      genericName,
      brand,
      category,
      description,
      uses,
      price,
      costPrice,
      discount = 0,
      stock = 0,
      lowStockThreshold = 15,
      prescriptionRequired = false,
      dosageForm = 'Tablet',
      strength = '',
      packSize = '10 Tablets',
      image,
    } = req.body;

    if (!name || !genericName || !brand || !category || price === undefined || costPrice === undefined) {
      return sendError(res, 'Please provide all mandatory medicine fields', 400);
    }

    const medicine = await Medicine.create({
      name,
      genericName,
      brand,
      category,
      description,
      uses: Array.isArray(uses) ? uses : typeof uses === 'string' ? uses.split(',').map((u) => u.trim()) : [],
      price: Number(price),
      costPrice: Number(costPrice),
      discount: Number(discount),
      stock: Number(stock),
      lowStockThreshold: Number(lowStockThreshold),
      prescriptionRequired: Boolean(prescriptionRequired),
      dosageForm,
      strength,
      packSize,
      image: image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60',
      isActive: true,
    });

    await auditService.log({
      adminId: req.user._id,
      adminEmail: req.user.email,
      action: 'MEDICINE_CREATED',
      entity: 'Medicine',
      entityId: medicine._id,
      newValue: { name, price, costPrice, stock },
      ipAddress: req.ip,
    });

    return sendSuccess(res, { medicine }, 'Medicine created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateMedicine = async (req, res, next) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findById(id);

    if (!medicine) {
      return sendError(res, 'Medicine not found', 404);
    }

    const previousValue = {
      price: medicine.price,
      costPrice: medicine.costPrice,
      stock: medicine.stock,
      isActive: medicine.isActive,
    };

    const updatableFields = [
      'name',
      'genericName',
      'brand',
      'category',
      'description',
      'uses',
      'price',
      'costPrice',
      'discount',
      'stock',
      'lowStockThreshold',
      'prescriptionRequired',
      'dosageForm',
      'strength',
      'packSize',
      'image',
      'isActive',
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'uses' && typeof req.body[field] === 'string') {
          medicine[field] = req.body[field].split(',').map((u) => u.trim());
        } else {
          medicine[field] = req.body[field];
        }
      }
    });

    await medicine.save();

    await auditService.log({
      adminId: req.user._id,
      adminEmail: req.user.email,
      action: 'MEDICINE_UPDATED',
      entity: 'Medicine',
      entityId: medicine._id,
      previousValue,
      newValue: {
        price: medicine.price,
        costPrice: medicine.costPrice,
        stock: medicine.stock,
        isActive: medicine.isActive,
      },
      ipAddress: req.ip,
    });

    return sendSuccess(res, { medicine }, 'Medicine updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteMedicine = async (req, res, next) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findById(id);

    if (!medicine) {
      return sendError(res, 'Medicine not found', 404);
    }

    // Soft deletion to maintain historical integrity of orders
    medicine.isActive = false;
    await medicine.save();

    await auditService.log({
      adminId: req.user._id,
      adminEmail: req.user.email,
      action: 'MEDICINE_DEACTIVATED',
      entity: 'Medicine',
      entityId: medicine._id,
      previousValue: { isActive: true },
      newValue: { isActive: false },
      ipAddress: req.ip,
    });

    return sendSuccess(res, { medicine }, 'Medicine deactivated successfully');
  } catch (error) {
    next(error);
  }
};

// --- Inventory Management ---

export const getInventory = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = { isActive: true };

    if (search && search.trim() !== '') {
      const term = search.trim();
      query.$or = [{ name: { $regex: term, $options: 'i' } }, { brand: { $regex: term, $options: 'i' } }];
    }

    const medicines = await Medicine.find(query).populate('category', 'name').sort({ stock: 1 });

    const inventoryList = medicines
      .map((med) => {
        let stockStatus = 'IN_STOCK';
        if (med.stock === 0) stockStatus = 'OUT_OF_STOCK';
        else if (med.stock <= med.lowStockThreshold) stockStatus = 'LOW_STOCK';

        return {
          _id: med._id,
          name: med.name,
          brand: med.brand,
          category: med.category?.name || 'Uncategorized',
          currentStock: med.stock,
          lowStockThreshold: med.lowStockThreshold,
          costPrice: med.costPrice,
          sellingPrice: med.price,
          stockValue: Math.round(med.stock * med.costPrice * 100) / 100,
          potentialRevenue: Math.round(med.stock * med.price * 100) / 100,
          status: stockStatus,
          prescriptionRequired: med.prescriptionRequired,
        };
      })
      .filter((item) => {
        if (!status || status === 'ALL') return true;
        return item.status === status;
      });

    // Summary calculations
    const totalInventoryValue = inventoryList.reduce((acc, curr) => acc + curr.stockValue, 0);
    const lowStockCount = inventoryList.filter((i) => i.status === 'LOW_STOCK').length;
    const outOfStockCount = inventoryList.filter((i) => i.status === 'OUT_OF_STOCK').length;

    return sendSuccess(res, {
      inventory: inventoryList,
      summary: {
        totalItems: inventoryList.length,
        totalInventoryValue: Math.round(totalInventoryValue),
        lowStockCount,
        outOfStockCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const adjustStock = async (req, res, next) => {
  try {
    const { medicineId, quantityDelta, reason } = req.body;

    if (!medicineId || quantityDelta === undefined) {
      return sendError(res, 'Medicine ID and quantity delta are required', 400);
    }

    const result = await inventoryService.adjustStock({
      medicineId,
      quantityDelta: Number(quantityDelta),
      reason,
      adminId: req.user._id,
    });

    await auditService.log({
      adminId: req.user._id,
      adminEmail: req.user.email,
      action: 'STOCK_ADJUSTED',
      entity: 'Medicine',
      entityId: medicineId,
      previousValue: { stock: result.transaction.previousStock },
      newValue: { stock: result.transaction.newStock, delta: quantityDelta, reason },
      ipAddress: req.ip,
    });

    return sendSuccess(res, result, 'Stock updated successfully');
  } catch (error) {
    next(error);
  }
};

export const getInventoryHistory = async (req, res, next) => {
  try {
    const { medicineId } = req.query;
    const query = medicineId ? { medicine: medicineId } : {};

    const history = await InventoryTransaction.find(query)
      .populate('medicine', 'name brand')
      .populate('admin', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    return sendSuccess(res, { history });
  } catch (error) {
    next(error);
  }
};

// --- Order Management ---

export const getAdminOrders = async (req, res, next) => {
  try {
    const { status, paymentStatus, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'ALL') {
      query.orderStatus = status;
    }

    if (paymentStatus && paymentStatus !== 'ALL') {
      query.paymentStatus = paymentStatus;
    }

    if (search && search.trim() !== '') {
      query.orderNumber = { $regex: search.trim(), $options: 'i' };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('prescription', 'fileUrl status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return sendSuccess(res, {
      orders,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note, adminNotes } = req.body;

    const order = await Order.findById(id).populate('user', 'name email phone');
    if (!order) {
      return sendError(res, 'Order not found', 404);
    }

    if (!Object.values(ORDER_STATUS).includes(status)) {
      return sendError(res, 'Invalid order status', 400);
    }

    const previousStatus = order.orderStatus;
    order.updateStatus(status, note || `Status updated to ${status}`, req.user.name);

    if (adminNotes !== undefined) {
      order.adminNotes = adminNotes;
    }

    await order.save();

    await auditService.log({
      adminId: req.user._id,
      adminEmail: req.user.email,
      action: 'ORDER_STATUS_UPDATED',
      entity: 'Order',
      entityId: order._id,
      previousValue: { orderStatus: previousStatus },
      newValue: { orderStatus: status, note },
      ipAddress: req.ip,
    });

    await notificationService.notifyOrderStatusUpdated(order, status);

    return sendSuccess(res, { order }, 'Order status updated successfully');
  } catch (error) {
    next(error);
  }
};

// --- Prescription Review Management ---

export const getAdminPrescriptions = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'ALL') {
      query.status = status;
    }

    const prescriptions = await Prescription.find(query)
      .populate('user', 'name email phone')
      .populate('order', 'orderNumber orderStatus total createdAt')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 });

    return sendSuccess(res, { prescriptions });
  } catch (error) {
    next(error);
  }
};

export const reviewPrescription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (![PRESCRIPTION_STATUS.APPROVED, PRESCRIPTION_STATUS.REJECTED].includes(status)) {
      return sendError(res, 'Invalid review status. Must be APPROVED or REJECTED.', 400);
    }

    const prescription = await Prescription.findById(id).populate('order');
    if (!prescription) {
      return sendError(res, 'Prescription not found', 404);
    }

    prescription.status = status;
    prescription.adminNotes = adminNotes || '';
    prescription.reviewedBy = req.user._id;
    prescription.reviewedAt = new Date();
    await prescription.save();

    // If attached to an order, update order status accordingly
    if (prescription.order) {
      const order = await Order.findById(prescription.order._id);
      if (order) {
        if (status === PRESCRIPTION_STATUS.APPROVED) {
          order.updateStatus(
            ORDER_STATUS.PRESCRIPTION_APPROVED,
            'Doctor prescription verified by pharmacist.',
            req.user.name
          );
          order.updateStatus(ORDER_STATUS.PROCESSING, 'Order processing in pharmacy.', 'System');
          await notificationService.notifyPrescriptionApproved(order, prescription);
        } else {
          order.updateStatus(
            ORDER_STATUS.PENDING,
            `Prescription rejected: ${adminNotes || 'Invalid or unreadable prescription'}. Please re-upload.`,
            req.user.name
          );
          await notificationService.notifyPrescriptionRejected(order, prescription, adminNotes);
        }
        await order.save();
      }
    }

    await auditService.log({
      adminId: req.user._id,
      adminEmail: req.user.email,
      action: status === PRESCRIPTION_STATUS.APPROVED ? 'PRESCRIPTION_APPROVED' : 'PRESCRIPTION_REJECTED',
      entity: 'Prescription',
      entityId: prescription._id,
      newValue: { status, adminNotes },
      ipAddress: req.ip,
    });

    return sendSuccess(res, { prescription }, `Prescription ${status.toLowerCase()} successfully`);
  } catch (error) {
    next(error);
  }
};

// --- User Management ---

export const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: ROLES.USER }).select('-passwordHash').sort({ createdAt: -1 });

    // Aggregate user order stats
    const userStats = await Promise.all(
      users.map(async (u) => {
        const userOrders = await Order.find({ user: u._id });
        const totalSpent = userOrders
          .filter((o) => o.orderStatus !== ORDER_STATUS.CANCELLED)
          .reduce((acc, curr) => acc + curr.total, 0);

        return {
          _id: u._id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          isActive: u.isActive,
          createdAt: u.createdAt,
          ordersCount: userOrders.length,
          totalSpent: Math.round(totalSpent),
        };
      })
    );

    return sendSuccess(res, { users: userStats });
  } catch (error) {
    next(error);
  }
};

export const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    if (user.role === ROLES.ADMIN) {
      return sendError(res, 'Cannot deactivate admin account', 400);
    }

    const prev = user.isActive;
    user.isActive = !user.isActive;
    await user.save();

    await auditService.log({
      adminId: req.user._id,
      adminEmail: req.user.email,
      action: user.isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
      entity: 'User',
      entityId: user._id,
      previousValue: { isActive: prev },
      newValue: { isActive: user.isActive },
      ipAddress: req.ip,
    });

    return sendSuccess(
      res,
      { user: { _id: user._id, name: user.name, isActive: user.isActive } },
      `User account ${user.isActive ? 'activated' : 'deactivated'} successfully`
    );
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await auditService.getRecentLogs(50);
    return sendSuccess(res, { logs });
  } catch (error) {
    next(error);
  }
};
