import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  MessageCircle, 
  FileText, 
  AlertTriangle, 
  Printer, 
  CheckCircle2,
  XCircle
} from 'lucide-react';
import OrderTracker from '../components/OrderTracker';
import api from '../services/api';
import { formatCurrency, formatDateTime, createWhatsAppUrl } from '../utils/formatters';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/${id}`);
      if (res.data.success) {
        setOrder(res.data.data.order);
      }
    } catch (err) {
      console.error('Error loading order details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? Stock will be returned to the pharmacy.')) {
      return;
    }

    try {
      setCancelling(true);
      const res = await api.post(`/orders/${id}/cancel`);
      if (res.data.success) {
        setOrder(res.data.data.order);
      } else {
        alert(res.data.message || 'Failed to cancel order');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error cancelling order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8 max-w-4xl mx-auto space-y-6">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="bg-white border border-slate-200 rounded-3xl p-8 h-80 animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Order not found</h2>
        <Link to="/orders" className="inline-block px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold">
          Back to Orders
        </Link>
      </div>
    );
  }

  const isCancellable = [
    'PENDING',
    'PAYMENT_PENDING',
    'PRESCRIPTION_PENDING',
    'PROCESSING',
  ].includes(order.orderStatus);

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-6">
      {/* Top Navigation & Print */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/orders')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Printer className="w-3.5 h-3.5" /> Print Invoice
          </button>
          <a
            href={createWhatsAppUrl(`Hello, I need help with Order #${order.orderNumber}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp Support
          </a>
        </div>
      </div>

      {/* Visual Step Tracker */}
      <OrderTracker order={order} />

      {/* Order Info & Items */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Invoice #{order.orderNumber}
            </h2>
            <div className="text-xs text-slate-500 mt-0.5">
              Placed on {formatDateTime(order.createdAt)}
            </div>
          </div>

          {isCancellable && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>

        {/* Prescription Details (if attached) */}
        {order.prescription && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-teal-600" />
              <div>
                <span className="font-bold text-slate-900">Prescription Document</span>
                <p className="text-slate-500">{order.prescription.originalName || 'Doctor_Prescription.pdf'}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                order.prescription.status === 'APPROVED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : order.prescription.status === 'REJECTED'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {order.prescription.status}
              </span>
              <a
                href={order.prescription.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-teal-600 hover:underline mt-0.5 font-semibold"
              >
                View File
              </a>
            </div>
          </div>
        )}

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3 text-center">Unit Price</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {item.genericName} • {item.brand}
                      {item.prescriptionRequired && (
                        <span className="ml-1 text-rose-600 font-bold">[Rx Required]</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center text-slate-700">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-800">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">
                    {formatCurrency(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Breakdown & Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-xs">
          {/* Shipping Address */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-2">
              <MapPin className="w-4 h-4 text-teal-600" /> Delivery Address
            </h4>
            <div className="font-semibold text-slate-800">{order.shippingAddress.fullName}</div>
            <div className="text-slate-600">{order.shippingAddress.streetAddress}</div>
            <div className="text-slate-600">
              {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
              <strong>{order.shippingAddress.postalCode}</strong>
            </div>
            <div className="text-slate-500 pt-1">Phone: {order.shippingAddress.phone}</div>
          </div>

          {/* Payment & Financial Totals */}
          <div className="space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Product Discount</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Delivery Charges</span>
              <span>{order.deliveryFee === 0 ? 'FREE' : formatCurrency(order.deliveryFee)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
              <span>Total Paid</span>
              <span className="text-teal-700">{formatCurrency(order.total)}</span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-slate-500">
              <span>Payment Mode:</span>
              <strong className="text-slate-800 font-mono">{order.paymentMethod}</strong>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Payment Status:</span>
              <strong className={order.paymentStatus === 'SUCCESS' ? 'text-emerald-600' : 'text-amber-600'}>
                {order.paymentStatus}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
