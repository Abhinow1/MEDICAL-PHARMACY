import React, { useState } from 'react';
import { X, Plus, Minus, Warehouse, Check } from 'lucide-react';
import api from '../../services/api';

const StockAdjustmentModal = ({ medicine, onClose, onAdjusted }) => {
  const [adjustmentType, setAdjustmentType] = useState('ADD'); // ADD or REMOVE
  const [quantity, setQuantity] = useState(10);
  const [reason, setReason] = useState('Received fresh stock batch from distributor');
  const [loading, setLoading] = useState(false);

  if (!medicine) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      alert('Please specify a positive quantity');
      return;
    }

    const delta = adjustmentType === 'ADD' ? qty : -qty;

    if (adjustmentType === 'REMOVE' && qty > medicine.currentStock) {
      alert(`Cannot remove ${qty} units. Current stock is only ${medicine.currentStock}`);
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/admin/inventory/adjust', {
        medicineId: medicine._id,
        quantityDelta: delta,
        reason,
      });

      if (res.data.success) {
        onAdjusted(res.data.data.medicine);
        onClose();
      } else {
        alert(res.data.message || 'Stock adjustment failed');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-bold">Inventory Stock Adjustment</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Selected Product
            </span>
            <div className="text-base font-bold text-slate-900 mt-0.5">{medicine.name}</div>
            <div className="text-xs text-slate-500">
              Current Available Stock: <strong className="text-slate-900">{medicine.currentStock} units</strong>
            </div>
          </div>

          {/* Action toggle: Add vs Remove */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Action</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAdjustmentType('ADD')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition ${
                  adjustmentType === 'ADD'
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Plus className="w-4 h-4" /> Add Stock
              </button>
              <button
                type="button"
                onClick={() => setAdjustmentType('REMOVE')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition ${
                  adjustmentType === 'REMOVE'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Minus className="w-4 h-4" /> Remove / Write-off
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Quantity ({adjustmentType === 'ADD' ? 'To Add' : 'To Deduct'})
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Audit Reason (Required)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              placeholder="e.g. Received new distributor batch #8812, Damaged in transit, etc."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 transition flex items-center gap-1.5 shadow-sm"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" /> Confirm Stock Change
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockAdjustmentModal;
