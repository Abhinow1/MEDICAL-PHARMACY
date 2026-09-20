import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  ArrowLeft,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

const CartPage = () => {
  const { 
    items, 
    subtotal, 
    discount, 
    deliveryFee, 
    grandTotal, 
    prescriptionRequired, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    loading 
  } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="py-16 max-w-lg mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your Medical Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Browse our certified pharmacy catalog to add essential medicines and health products to your order.
        </p>
        <Link
          to="/medicines"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition"
        >
          <span>Browse Medicines</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-6 max-w-6xl mx-auto space-y-6 pb-32 sm:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Shopping Cart</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              {items.length} product(s)
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review items before proceeding to prescription verification and checkout
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      {/* Prescription Notice if cart contains Rx items */}
      {prescriptionRequired && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-800">
          <FileText className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Doctor Prescription Required:</strong>
            One or more medicines in your cart require a valid prescription. You will be prompted to attach your prescription photo or PDF during checkout.
          </div>
        </div>
      )}

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100">
          {items.map((item) => {
            const med = item.medicine;
            return (
              <div key={item._id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Product Info */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <img
                    src={med.image}
                    alt={med.name}
                    className="w-16 h-16 object-contain rounded-xl bg-slate-50 p-2 border border-slate-100 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider">
                        {med.brand}
                      </span>
                      {med.prescriptionRequired && (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                          Rx
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/medicines/${med._id}`}
                      className="text-sm font-bold text-slate-900 hover:text-teal-600 truncate block transition"
                    >
                      {med.name}
                    </Link>
                    <div className="text-xs text-slate-400">
                      {med.packSize} • {formatCurrency(med.finalPrice)} each
                    </div>
                  </div>
                </div>

                {/* Stepper & Line Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || loading}
                      className="p-1.5 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      disabled={item.quantity >= med.stock || loading}
                      className="p-1.5 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[70px]">
                    <div className="text-sm font-bold text-slate-900">
                      {formatCurrency(item.itemTotal)}
                    </div>
                    {med.discount > 0 && (
                      <span className="text-[10px] text-emerald-600 font-semibold">
                        Saved {med.discount}%
                      </span>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition"
                    title="Remove medicine"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 sticky top-24">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
            Order Financial Summary
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Items Total (MRP)</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex items-center justify-between text-emerald-600 font-medium">
                <span>Pharmacy Product Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-slate-400" /> Delivery Fee
              </span>
              <span>
                {deliveryFee === 0 ? (
                  <span className="text-emerald-600 font-bold uppercase text-[11px]">Free</span>
                ) : (
                  formatCurrency(deliveryFee)
                )}
              </span>
            </div>

            {deliveryFee > 0 && (
              <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">
                Add ₹{500 - (subtotal - discount)} more to qualify for <strong>FREE Delivery</strong>!
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-base font-bold text-slate-900">
              <span>Grand Total</span>
              <span className="text-teal-700">{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure 256-bit encrypted checkout</span>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Checkout Bar */}
      <div className="md:hidden fixed bottom-14 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg pb-[calc(0.4rem+env(safe-area-inset-bottom,0px))]">
        <div>
          <span className="text-[10px] text-slate-400 block font-semibold leading-tight">Grand Total</span>
          <span className="text-base font-black text-teal-700">
            {formatCurrency(grandTotal)}
          </span>
        </div>

        <button
          onClick={() => navigate('/checkout')}
          className="h-10 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default CartPage;
