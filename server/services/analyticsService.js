import Order from '../models/Order.js';
import Medicine from '../models/Medicine.js';
import User from '../models/User.js';
import Expense from '../models/Expense.js';
import { ORDER_STATUS, ROLES } from '../config/constants.js';

class AnalyticsService {
  /**
   * Get main dashboard overview KPIs
   */
  async getOverview() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    // Non-cancelled orders for financial metrics
    const validOrdersFilter = {
      orderStatus: { $nin: [ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUNDED] },
    };

    // 1. Total Customers
    const totalCustomers = await User.countDocuments({ role: ROLES.USER });

    // 2. Orders Counts
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({
      orderStatus: {
        $in: [
          ORDER_STATUS.PENDING,
          ORDER_STATUS.PAYMENT_PENDING,
          ORDER_STATUS.PRESCRIPTION_PENDING,
          ORDER_STATUS.PROCESSING,
        ],
      },
    });

    // 3. Today's Revenue & Orders
    const todayOrders = await Order.find({
      ...validOrdersFilter,
      createdAt: { $gte: todayStart },
    });
    const todaySales = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const todayGrossProfit = todayOrders.reduce((sum, o) => sum + (o.grossProfit || 0), 0);

    // 4. Monthly Revenue & Orders
    const monthlyOrders = await Order.find({
      ...validOrdersFilter,
      createdAt: { $gte: monthStart },
    });
    const monthlySales = monthlyOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const monthlyGrossProfit = monthlyOrders.reduce((sum, o) => sum + (o.grossProfit || 0), 0);

    // 5. Total Lifetime Revenue & Cost
    const allValidOrders = await Order.find(validOrdersFilter);
    const totalRevenue = allValidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalProductCost = allValidOrders.reduce((sum, o) => sum + (o.totalCost || 0), 0);
    const totalGrossProfit = totalRevenue - totalProductCost;

    // 6. Total Operational Expenses
    const allExpenses = await Expense.find();
    const totalExpenses = allExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);

    // Monthly Expenses
    const monthlyExpensesDoc = await Expense.find({ date: { $gte: monthStart } });
    const monthlyExpenses = monthlyExpensesDoc.reduce((sum, e) => sum + (e.amount || 0), 0);

    // 7. Net Profit
    const netProfit = totalGrossProfit - totalExpenses;
    const monthlyNetProfit = monthlyGrossProfit - monthlyExpenses;

    // 8. Low Stock Count
    const lowStockCount = await Medicine.countDocuments({
      isActive: true,
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    });

    // 9. Pending Prescriptions
    const pendingPrescriptionsCount = await Order.countDocuments({
      orderStatus: ORDER_STATUS.PRESCRIPTION_PENDING,
    });

    // 10. Average Order Value (AOV)
    const averageOrderValue = allValidOrders.length > 0 ? Math.round(totalRevenue / allValidOrders.length) : 0;

    return {
      todaySales,
      todayGrossProfit,
      monthlySales,
      monthlyGrossProfit,
      monthlyExpenses,
      monthlyNetProfit,
      totalOrders,
      pendingOrders,
      totalCustomers,
      lowStockCount,
      pendingPrescriptionsCount,
      totalRevenue,
      totalProductCost,
      totalGrossProfit,
      totalExpenses,
      netProfit,
      averageOrderValue,
    };
  }

  /**
   * Daily sales and revenue trend for charts
   */
  async getSalesTrend(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      orderStatus: { $nin: [ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUNDED] },
      createdAt: { $gte: startDate },
    }).sort({ createdAt: 1 });

    const expenses = await Expense.find({
      date: { $gte: startDate },
    }).sort({ date: 1 });

    // Group by YYYY-MM-DD
    const trendMap = {};

    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateKey = d.toISOString().split('T')[0];
      trendMap[dateKey] = {
        date: dateKey,
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: 0,
        cost: 0,
        grossProfit: 0,
        expenses: 0,
        netProfit: 0,
        ordersCount: 0,
      };
    }

    for (const order of orders) {
      const dateKey = new Date(order.createdAt).toISOString().split('T')[0];
      if (trendMap[dateKey]) {
        trendMap[dateKey].revenue += order.total || 0;
        trendMap[dateKey].cost += order.totalCost || 0;
        trendMap[dateKey].grossProfit += order.grossProfit || 0;
        trendMap[dateKey].ordersCount += 1;
      }
    }

    for (const exp of expenses) {
      const dateKey = new Date(exp.date).toISOString().split('T')[0];
      if (trendMap[dateKey]) {
        trendMap[dateKey].expenses += exp.amount || 0;
      }
    }

    // Calculate net profit for each day
    const trendList = Object.values(trendMap).map((day) => ({
      ...day,
      revenue: Math.round(day.revenue),
      cost: Math.round(day.cost),
      grossProfit: Math.round(day.grossProfit),
      expenses: Math.round(day.expenses),
      netProfit: Math.round(day.grossProfit - day.expenses),
    }));

    return trendList;
  }

  /**
   * Top selling medicines
   */
  async getTopSellingProducts(limit = 5) {
    const orders = await Order.find({
      orderStatus: { $nin: [ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUNDED] },
    });

    const productMap = {};

    for (const order of orders) {
      for (const item of order.items) {
        const id = item.medicine.toString();
        if (!productMap[id]) {
          productMap[id] = {
            id,
            name: item.name,
            brand: item.brand,
            totalQuantity: 0,
            totalRevenue: 0,
            totalCost: 0,
            grossProfit: 0,
          };
        }
        productMap[id].totalQuantity += item.quantity;
        productMap[id].totalRevenue += item.subtotal;
        productMap[id].totalCost += item.costPrice * item.quantity;
        productMap[id].grossProfit += item.subtotal - item.costPrice * item.quantity;
      }
    }

    return Object.values(productMap)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, limit);
  }

  /**
   * Category sales breakdown
   */
  async getCategorySales() {
    const orders = await Order.find({
      orderStatus: { $nin: [ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUNDED] },
    }).populate({
      path: 'items.medicine',
      populate: { path: 'category', select: 'name' },
    });

    const categoryMap = {};

    for (const order of orders) {
      for (const item of order.items) {
        const categoryName = item.medicine?.category?.name || 'General';
        if (!categoryMap[categoryName]) {
          categoryMap[categoryName] = {
            category: categoryName,
            revenue: 0,
            quantity: 0,
          };
        }
        categoryMap[categoryName].revenue += item.subtotal;
        categoryMap[categoryName].quantity += item.quantity;
      }
    }

    return Object.values(categoryMap);
  }
}

export default new AnalyticsService();
