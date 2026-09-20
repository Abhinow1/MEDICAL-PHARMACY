import Expense from '../models/Expense.js';
import auditService from '../services/auditService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { EXPENSE_CATEGORIES } from '../config/constants.js';

export const getExpenses = async (req, res, next) => {
  try {
    const { category, startDate, endDate } = req.query;
    const query = {};

    if (category && category !== 'ALL') {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query).populate('recordedBy', 'name email').sort({ date: -1 });

    const totalAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return sendSuccess(res, {
      expenses,
      totalAmount: Math.round(totalAmount),
    });
  } catch (error) {
    next(error);
  }
};

export const createExpense = async (req, res, next) => {
  try {
    const { title, category, amount, date, notes } = req.body;

    if (!title || !category || amount === undefined) {
      return sendError(res, 'Please provide title, category, and amount', 400);
    }

    if (!Object.values(EXPENSE_CATEGORIES).includes(category)) {
      return sendError(res, 'Invalid expense category', 400);
    }

    const expense = await Expense.create({
      title,
      category,
      amount: Number(amount),
      date: date ? new Date(date) : new Date(),
      notes: notes || '',
      recordedBy: req.user._id,
    });

    await auditService.log({
      adminId: req.user._id,
      adminEmail: req.user.email,
      action: 'EXPENSE_RECORDED',
      entity: 'Expense',
      entityId: expense._id,
      newValue: { title, category, amount },
      ipAddress: req.ip,
    });

    return sendSuccess(res, { expense }, 'Expense recorded successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      return sendError(res, 'Expense not found', 404);
    }

    await auditService.log({
      adminId: req.user._id,
      adminEmail: req.user.email,
      action: 'EXPENSE_DELETED',
      entity: 'Expense',
      entityId: id,
      previousValue: { title: expense.title, amount: expense.amount },
      ipAddress: req.ip,
    });

    return sendSuccess(res, {}, 'Expense deleted successfully');
  } catch (error) {
    next(error);
  }
};
