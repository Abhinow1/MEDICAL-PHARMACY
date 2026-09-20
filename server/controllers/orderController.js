import Order from '../models/Order.js';
import Medicine from '../models/Medicine.js';
import Cart from '../models/Cart.js';
import Prescription from '../models/Prescription.js';
import inventoryService from '../services/inventoryService.js';
import notificationService from '../services/notificationService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_METHODS } from '../config/constants.js';

export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod = PAYMENT_METHODS.TEST, prescriptionId = null } = req.body;

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.streetAddress || !shippingAddress.postalCode) {
      return sendError(res, 'Complete shipping address is required', 400);
    }

    // Retrieve user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.medicine');
    if (!cart || cart.items.length === 0) {
      return sendError(res, 'Your shopping cart is empty', 400);
    }

    let subtotal = 0;
    let totalDiscount = 0;
    let totalCost = 0;
    let prescriptionRequired = false;
    const orderItems = [];

    // Verify stock and calculate all pricing strictly from database
    for (const item of cart.items) {
      const med = await Medicine.findById(item.medicine._id);
      if (!med || !med.isActive) {
        return sendError(res, `Medicine ${item.medicine.name} is no longer available`, 400);
      }

      if (med.stock < item.quantity) {
        return sendError(
          res,
          `Insufficient stock for "${med.name}". Available: ${med.stock}, requested: ${item.quantity}`,
          400
        );
      }

      const originalPrice = med.price;
      const discount = med.discount || 0;
      const finalUnitPrice = discount > 0 ? originalPrice - (originalPrice * discount) / 100 : originalPrice;
      const itemSubtotal = Math.round(finalUnitPrice * item.quantity * 100) / 100;
      const itemDiscountAmount = Math.round(((originalPrice * discount) / 100) * item.quantity * 100) / 100;
      const itemCost = med.costPrice * item.quantity;

      subtotal += originalPrice * item.quantity;
      totalDiscount += itemDiscountAmount;
      totalCost += itemCost;

      if (med.prescriptionRequired) {
        prescriptionRequired = true;
      }

      orderItems.push({
        medicine: med._id,
        name: med.name,
        brand: med.brand,
        genericName: med.genericName,
        price: finalUnitPrice,
        costPrice: med.costPrice,
        quantity: item.quantity,
        subtotal: itemSubtotal,
        prescriptionRequired: med.prescriptionRequired,
      });
    }

    // Prescription validation: If required, a valid prescription must be linked
    let validPrescription = null;
    if (prescriptionRequired) {
      if (!prescriptionId) {
        return sendError(
          res,
          'One or more medicines in your cart require a valid prescription. Please upload a prescription.',
          400
        );
      }

      validPrescription = await Prescription.findOne({
        _id: prescriptionId,
        user: req.user._id,
      });

      if (!validPrescription) {
        return sendError(res, 'Uploaded prescription not found or does not belong to user.', 400);
      }
    }

    const discountedTotal = subtotal - totalDiscount;
    const deliveryFee = discountedTotal >= 500 ? 0 : 40;
    const grandTotal = Math.round((discountedTotal + deliveryFee) * 100) / 100;
    const grossProfit = Math.round((discountedTotal - totalCost) * 100) / 100;

    const orderNumber = `MED-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    // Initial order status determination
    let initialOrderStatus = ORDER_STATUS.PENDING;
    let initialPaymentStatus = PAYMENT_STATUS.PENDING;

    if (prescriptionRequired) {
      initialOrderStatus = ORDER_STATUS.PRESCRIPTION_PENDING;
    } else if (paymentMethod === PAYMENT_METHODS.COD) {
      initialOrderStatus = ORDER_STATUS.PROCESSING;
      initialPaymentStatus = PAYMENT_STATUS.PENDING;
    } else {
      initialOrderStatus = ORDER_STATUS.PAYMENT_PENDING;
    }

    const order = new Order({
      orderNumber,
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round(totalDiscount * 100) / 100,
      deliveryFee,
      total: grandTotal,
      totalCost: Math.round(totalCost * 100) / 100,
      grossProfit,
      paymentMethod,
      paymentStatus: initialPaymentStatus,
      orderStatus: initialOrderStatus,
      prescriptionRequired,
      prescription: validPrescription ? validPrescription._id : null,
      statusHistory: [
        {
          status: initialOrderStatus,
          note: prescriptionRequired
            ? 'Order placed. Awaiting pharmacist prescription review.'
            : 'Order placed successfully.',
          updatedBy: 'Customer',
        },
      ],
    });

    await order.save();

    // Deduct stock atomically
    await inventoryService.deductStockForOrder(orderItems, orderNumber);

    // Link prescription to order if applicable
    if (validPrescription) {
      validPrescription.order = order._id;
      await validPrescription.save();
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    await notificationService.notifyOrderPlaced(order);

    return sendSuccess(res, { order }, 'Order placed successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments({ user: req.user._id });
    const orders = await Order.find({ user: req.user._id })
      .populate('items.medicine', 'image')
      .populate('prescription', 'fileUrl status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return sendSuccess(res, {
      orders,
      pagination: {
        total: totalOrders,
        page,
        limit,
        totalPages: Math.ceil(totalOrders / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({
      _id: id,
      ...(req.user.role !== 'ADMIN' ? { user: req.user._id } : {}),
    })
      .populate('items.medicine', 'name brand genericName image packSize')
      .populate('prescription', 'fileUrl originalName mimeType status adminNotes')
      .populate('user', 'name email phone');

    if (!order) {
      return sendError(res, 'Order not found', 404);
    }

    return sendSuccess(res, { order });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({
      _id: id,
      ...(req.user.role !== 'ADMIN' ? { user: req.user._id } : {}),
    });

    if (!order) {
      return sendError(res, 'Order not found', 404);
    }

    const cancellableStatuses = [
      ORDER_STATUS.PENDING,
      ORDER_STATUS.PAYMENT_PENDING,
      ORDER_STATUS.PRESCRIPTION_PENDING,
      ORDER_STATUS.PROCESSING,
    ];

    if (!cancellableStatuses.includes(order.orderStatus)) {
      return sendError(
        res,
        `Cannot cancel order in "${order.orderStatus}" state. Orders already packed or shipped cannot be self-cancelled.`,
        400
      );
    }

    order.updateStatus(ORDER_STATUS.CANCELLED, 'Cancelled by customer', req.user.name);
    await order.save();

    // Restore stock back to inventory
    await inventoryService.restoreStockForOrder(order.items, order.orderNumber);

    return sendSuccess(res, { order }, 'Order cancelled successfully');
  } catch (error) {
    next(error);
  }
};
