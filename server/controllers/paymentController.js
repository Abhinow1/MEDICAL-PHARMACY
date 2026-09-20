import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import paymentService from '../services/paymentService.js';
import notificationService from '../services/notificationService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_METHODS } from '../config/constants.js';

export const createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return sendError(res, 'Order not found', 404);
    }

    if (order.paymentStatus === PAYMENT_STATUS.SUCCESS) {
      return sendError(res, 'Order has already been paid for.', 400);
    }

    // Call paymentService abstraction
    const paymentData = await paymentService.createPaymentOrder({
      orderId: order._id,
      orderNumber: order.orderNumber,
      amount: order.total,
      currency: 'INR',
    });

    // Create initiated payment record
    const payment = await Payment.create({
      order: order._id,
      user: req.user._id,
      amount: order.total,
      currency: 'INR',
      provider: paymentData.provider,
      razorpayOrderId: paymentData.razorpayOrderId,
      status: PAYMENT_STATUS.INITIATED,
    });

    order.payment = payment._id;
    await order.save();

    return sendSuccess(res, {
      ...paymentData,
      paymentId: payment._id,
    }, 'Payment intent created');
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature, isTestPayment } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return sendError(res, 'Order not found', 404);
    }

    if (order.paymentStatus === PAYMENT_STATUS.SUCCESS) {
      return sendSuccess(res, { order }, 'Order is already marked as paid');
    }

    let verificationResult;

    if (isTestPayment || order.paymentMethod === PAYMENT_METHODS.TEST) {
      verificationResult = await paymentService.verifyTestPayment({
        orderId: order._id,
        amount: order.total,
      });
    } else {
      // Live Razorpay HMAC verification
      verificationResult = paymentService.verifyPaymentSignature({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      });
    }

    if (!verificationResult.valid) {
      return sendError(res, verificationResult.message || 'Payment verification failed', 400);
    }

    // Payment verified on server! Update Payment record
    let payment = await Payment.findOne({ order: order._id }).sort({ createdAt: -1 });
    if (!payment) {
      payment = new Payment({
        order: order._id,
        user: req.user._id,
        amount: order.total,
      });
    }

    payment.status = PAYMENT_STATUS.SUCCESS;
    payment.razorpayOrderId = razorpayOrderId || '';
    payment.razorpayPaymentId = razorpayPaymentId || verificationResult.transactionId;
    payment.razorpaySignature = razorpaySignature || '';
    payment.transactionId = razorpayPaymentId || verificationResult.transactionId;
    await payment.save();

    order.paymentStatus = PAYMENT_STATUS.SUCCESS;
    order.payment = payment._id;

    // Update order status appropriately
    if (order.prescriptionRequired && order.orderStatus === ORDER_STATUS.PRESCRIPTION_PENDING) {
      order.updateStatus(
        ORDER_STATUS.PRESCRIPTION_PENDING,
        'Payment confirmed. Awaiting pharmacist prescription verification.',
        'PaymentGateway'
      );
    } else {
      order.updateStatus(ORDER_STATUS.PAID, 'Payment verified successfully.', 'PaymentGateway');
      order.updateStatus(ORDER_STATUS.PROCESSING, 'Order sent to pharmacy dispensary.', 'System');
    }

    await order.save();
    await notificationService.notifyPaymentSuccess(order, payment);

    return sendSuccess(res, { order, payment }, 'Payment verified successfully');
  } catch (error) {
    next(error);
  }
};
