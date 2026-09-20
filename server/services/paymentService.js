import crypto from 'crypto';
import { PAYMENT_STATUS, PAYMENT_METHODS } from '../config/constants.js';

class PaymentService {
  constructor() {
    this.keyId = process.env.RAZORPAY_KEY_ID || '';
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    this.isLive = Boolean(this.keyId && this.keySecret && this.keyId.startsWith('rzp_'));
  }

  /**
   * Create an order with payment provider or mock in test mode
   */
  async createPaymentOrder({ orderId, orderNumber, amount, currency = 'INR' }) {
    const amountInPaise = Math.round(amount * 100);

    if (!this.isLive) {
      // Test / Simulated mode
      const mockRazorpayOrderId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      return {
        isTestMode: true,
        provider: PAYMENT_METHODS.TEST,
        razorpayOrderId: mockRazorpayOrderId,
        amount: amountInPaise,
        currency,
        orderId,
        orderNumber,
      };
    }

    try {
      // Live Razorpay API call
      const authHeader = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64');
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${authHeader}`,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency,
          receipt: orderNumber,
          payment_capture: 1,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.description || 'Failed to create Razorpay order');
      }

      return {
        isTestMode: false,
        provider: PAYMENT_METHODS.RAZORPAY,
        razorpayOrderId: data.id,
        amount: data.amount,
        currency: data.currency,
        keyId: this.keyId,
        orderId,
        orderNumber,
      };
    } catch (error) {
      console.error('PaymentService createPaymentOrder error:', error.message);
      throw error;
    }
  }

  /**
   * Verify Razorpay or test payment signature
   */
  verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
    if (!this.isLive) {
      // Test mode verification
      if (!razorpayOrderId || !razorpayPaymentId) {
        return { valid: false, message: 'Missing order or payment ID' };
      }
      return { valid: true, status: PAYMENT_STATUS.SUCCESS };
    }

    try {
      const generatedSignature = crypto
        .createHmac('sha256', this.keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      const isValid = generatedSignature === razorpaySignature;
      return {
        valid: isValid,
        status: isValid ? PAYMENT_STATUS.SUCCESS : PAYMENT_STATUS.FAILED,
        message: isValid ? 'Signature verified' : 'Invalid payment signature',
      };
    } catch (error) {
      return { valid: false, status: PAYMENT_STATUS.FAILED, message: error.message };
    }
  }

  /**
   * Simulated fast-checkout verification for development and automated testing
   */
  async verifyTestPayment({ orderId, amount }) {
    const mockPaymentId = `pay_sim_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    return {
      valid: true,
      status: PAYMENT_STATUS.SUCCESS,
      transactionId: mockPaymentId,
      provider: PAYMENT_METHODS.TEST,
    };
  }
}

export default new PaymentService();
