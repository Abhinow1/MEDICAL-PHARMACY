import express from 'express';
import {
  getAnalyticsOverview,
  getSalesTrend,
  getTopProducts,
  getCategoryAnalytics,
  getAdminMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getInventory,
  adjustStock,
  getInventoryHistory,
  getAdminOrders,
  updateOrderStatus,
  getAdminPrescriptions,
  reviewPrescription,
  getAdminUsers,
  toggleUserStatus,
  getAuditLogs,
} from '../controllers/adminController.js';
import { getExpenses, createExpense, deleteExpense } from '../controllers/expenseController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

// Strict security: all admin routes require authentication and ADMIN role
router.use(protect, authorize(ROLES.ADMIN));

// Analytics & Reports
router.get('/analytics/overview', getAnalyticsOverview);
router.get('/analytics/sales', getSalesTrend);
router.get('/analytics/top-products', getTopProducts);
router.get('/analytics/categories', getCategoryAnalytics);

// Medicine Management
router.get('/medicines', getAdminMedicines);
router.post('/medicines', createMedicine);
router.put('/medicines/:id', updateMedicine);
router.delete('/medicines/:id', deleteMedicine);

// Inventory Management
router.get('/inventory', getInventory);
router.post('/inventory/adjust', adjustStock);
router.get('/inventory/history', getInventoryHistory);

// Order Management
router.get('/orders', getAdminOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Prescription Review Queue
router.get('/prescriptions', getAdminPrescriptions);
router.put('/prescriptions/:id/review', reviewPrescription);

// User Management
router.get('/users', getAdminUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);

// P&L Operational Expenses
router.get('/expenses', getExpenses);
router.post('/expenses', createExpense);
router.delete('/expenses/:id', deleteExpense);

// Audit Logging
router.get('/audit-logs', getAuditLogs);

export default router;
