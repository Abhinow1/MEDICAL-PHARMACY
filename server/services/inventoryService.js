import Medicine from '../models/Medicine.js';
import InventoryTransaction from '../models/InventoryTransaction.js';
import { INVENTORY_ACTION } from '../config/constants.js';

class InventoryService {
  /**
   * Atomically reserve / deduct stock for order items
   */
  async deductStockForOrder(items, orderNumber, adminId = null) {
    const deductions = [];

    for (const item of items) {
      const med = await Medicine.findById(item.medicine);
      if (!med) {
        throw new Error(`Medicine ${item.name} not found`);
      }

      if (med.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${med.name}. Available: ${med.stock}, requested: ${item.quantity}`);
      }

      const previousStock = med.stock;
      const newStock = previousStock - item.quantity;
      med.stock = newStock;
      await med.save();

      // Log transaction
      const txn = await InventoryTransaction.create({
        medicine: med._id,
        changeType: INVENTORY_ACTION.ORDER_FULFILLED,
        quantity: -item.quantity,
        previousStock,
        newStock,
        reason: `Deducted for Order #${orderNumber}`,
        referenceId: orderNumber,
        admin: adminId,
      });

      deductions.push(txn);
    }

    return deductions;
  }

  /**
   * Restore stock if order is cancelled
   */
  async restoreStockForOrder(items, orderNumber, adminId = null) {
    for (const item of items) {
      const med = await Medicine.findById(item.medicine);
      if (med) {
        const previousStock = med.stock;
        const newStock = previousStock + item.quantity;
        med.stock = newStock;
        await med.save();

        await InventoryTransaction.create({
          medicine: med._id,
          changeType: INVENTORY_ACTION.STOCK_ADDED,
          quantity: item.quantity,
          previousStock,
          newStock,
          reason: `Restored from Cancelled Order #${orderNumber}`,
          referenceId: orderNumber,
          admin: adminId,
        });
      }
    }
  }

  /**
   * Admin manual stock adjustment
   */
  async adjustStock({ medicineId, quantityDelta, reason, adminId }) {
    const med = await Medicine.findById(medicineId);
    if (!med) {
      throw new Error('Medicine not found');
    }

    const previousStock = med.stock;
    const newStock = previousStock + quantityDelta;
    if (newStock < 0) {
      throw new Error('Stock cannot be adjusted below zero');
    }

    med.stock = newStock;
    await med.save();

    const changeType = quantityDelta >= 0 ? INVENTORY_ACTION.STOCK_ADDED : INVENTORY_ACTION.STOCK_REMOVED;

    const txn = await InventoryTransaction.create({
      medicine: med._id,
      changeType,
      quantity: quantityDelta,
      previousStock,
      newStock,
      reason: reason || 'Manual Admin Adjustment',
      admin: adminId,
    });

    return { medicine: med, transaction: txn };
  }

  /**
   * Get medicines below their low-stock threshold
   */
  async getLowStockMedicines() {
    return await Medicine.find({
      isActive: true,
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    }).populate('category', 'name');
  }
}

export default new InventoryService();
