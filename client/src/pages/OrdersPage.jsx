import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ChevronRight, 
  Clock, 
  MessageCircle, 
  AlertCircle, 
  RotateCcw,
  FileText
} from 'lucide-react';
import api from '../services/api';
import { formatCurrency, formatDate, createWhatsAppUrl } from '../utils/formatters';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get('/orders/my');
        if (res.data.success) {
          setOrders(res.data.data.orders || []);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="py-8 max-w-4xl mx-auto space-y-4">
        <div className="h-6 w-40 bg-slate-200 rounded animate-pulse" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 h-36 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="py-6 max-w-5xl mx-auto space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Your Medical Orders
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Track status, view digital invoices, and reorder routine medications
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No orders placed yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't ordered any medications yet. Browse our extensive pharmacy catalog to place your first order.
          </p>
          <Link
            to="/medicines"
            className="inline-block px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-teal-700 transition"
          >
            Start Browsing
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500">Order</span>{' '}
                  <strong className="text-slate-900 font-mono text-sm">#{order.orderNumber}</strong>
                  <span className="text-slate-400 mx-2">•</span>
                  <span className="text-slate-500">{formatDate(order.createdAt)}</span>
                </div>

                <div className="flex items-center gap-2">
                  {order.prescriptionRequired && (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                      Rx
                    </span>
                  )}
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      order.orderStatus === 'DELIVERED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : order.orderStatus === 'CANCELLED'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-teal-50 text-teal-800 border border-teal-200'
                    }`}
                  >
                    {order.orderStatus.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Order Items Snippet */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="text-slate-700 font-medium">
                      • {item.name} <span className="text-slate-400 font-normal">× {item.quantity}</span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="text-[11px] text-slate-400">
                      + {order.items.length - 3} more product(s)
                    </div>
                  )}
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-base font-bold text-slate-900">
                    {formatCurrency(order.total)}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Payment: <strong className={order.paymentStatus === 'SUCCESS' ? 'text-emerald-600' : 'text-amber-600'}>{order.paymentStatus}</strong>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <a
                  href={createWhatsAppUrl(`Hello Pharmacist, I need help regarding Order #${order.orderNumber}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-700 hover:underline font-semibold"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Support on WhatsApp</span>
                </a>

                <Link
                  to={`/orders/${order._id}`}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold transition"
                >
                  <span>Track & Details</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
