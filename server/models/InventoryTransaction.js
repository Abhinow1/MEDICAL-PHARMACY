import mongoose from 'mongoose';
import { INVENTORY_ACTION } from '../config/constants.js';

const inventoryTransactionSchema = new mongoose.Schema(
  {
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true,
    },
    changeType: {
      type: String,
      enum: Object.values(INVENTORY_ACTION),
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    previousStock: {
      type: Number,
      required: true,
    },
    newStock: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      default: '',
    },
    referenceId: {
      type: String, // Order ID or purchase receipt ID
      default: '',
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const InventoryTransaction = mongoose.model('InventoryTransaction', inventoryTransactionSchema);
export default InventoryTransaction;
