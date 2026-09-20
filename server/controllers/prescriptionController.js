import Prescription from '../models/Prescription.js';
import Order from '../models/Order.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { PRESCRIPTION_STATUS, ORDER_STATUS } from '../config/constants.js';

export const uploadPrescriptionFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 'No prescription file provided. Please upload a JPG, PNG, or PDF file.', 400);
    }

    const { orderId } = req.body;

    const fileUrl = `/uploads/prescriptions/${req.file.filename}`;

    const prescription = await Prescription.create({
      user: req.user._id,
      order: orderId || null,
      fileUrl,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      status: PRESCRIPTION_STATUS.PENDING,
    });

    // If orderId is provided, link prescription to order
    if (orderId) {
      const order = await Order.findOne({ _id: orderId, user: req.user._id });
      if (order) {
        order.prescription = prescription._id;
        if (order.prescriptionRequired) {
          order.updateStatus(ORDER_STATUS.PRESCRIPTION_PENDING, 'New prescription document uploaded by customer.', 'Customer');
        }
        await order.save();
      }
    }

    return sendSuccess(res, { prescription }, 'Prescription uploaded successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getMyPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('order', 'orderNumber orderStatus total createdAt');

    return sendSuccess(res, { prescriptions });
  } catch (error) {
    next(error);
  }
};

export const getPrescriptionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prescription = await Prescription.findOne({
      _id: id,
      ...(req.user.role !== 'ADMIN' ? { user: req.user._id } : {}),
    })
      .populate('user', 'name email phone')
      .populate('order', 'orderNumber orderStatus total');

    if (!prescription) {
      return sendError(res, 'Prescription not found', 404);
    }

    return sendSuccess(res, { prescription });
  } catch (error) {
    next(error);
  }
};
