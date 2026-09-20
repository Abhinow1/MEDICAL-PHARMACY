import mongoose from 'mongoose';
import { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_METHODS } from '../config/constants.js';

const orderItemSchema = new mongoose.Schema({
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    required: true,
  },
  name: { type: String, required: true },
  brand: { type: String, default: '' },
  genericName: { type: String, default: '' },
  price: { type: Number, required: true }, // Selling price at moment of order
  costPrice: { type: Number, required: true }, // Cost price at moment of order for P&L
  quantity: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true },
  prescriptionRequired: { type: Boolean, default: false },
});

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: '' },
  updatedBy: { type: String, default: 'System' },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      streetAddress: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      landmark: { type: String, default: '' },
    },
    subtotal: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true, // Sum of (costPrice * quantity)
    },
    grossProfit: {
      type: Number,
      required: true, // total (subtotal - discount) - totalCost
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHODS),
      default: PAYMENT_METHODS.TEST,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    orderStatus: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
    },
    prescriptionRequired: {
      type: Boolean,
      default: false,
    },
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prescription',
      default: null,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null,
    },
    adminNotes: {
      type: String,
      default: '',
    },
    statusHistory: [statusHistorySchema],
  },
  {
    timestamps: true,
  }
);

// Helper method to add status transition
orderSchema.methods.updateStatus = function (newStatus, note = '', updatedBy = 'System') {
  this.orderStatus = newStatus;
  this.statusHistory.push({
    status: newStatus,
    note,
    updatedBy,
    timestamp: new Date(),
  });
};

const Order = mongoose.model('Order', orderSchema);
export default Order;
