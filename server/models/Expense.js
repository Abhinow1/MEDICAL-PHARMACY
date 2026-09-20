import mongoose from 'mongoose';
import { EXPENSE_CATEGORIES } from '../config/constants.js';

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide expense title'],
      trim: true,
    },
    category: {
      type: String,
      enum: Object.values(EXPENSE_CATEGORIES),
      required: [true, 'Please provide expense category'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide expense amount'],
      min: [0, 'Expense amount must be positive'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
