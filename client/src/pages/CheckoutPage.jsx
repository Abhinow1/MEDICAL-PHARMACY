import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, 
  CreditCard, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  AlertCircle,
  Plus,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatCurrency } from '../utils/formatters';

const CheckoutPage = () => {
  const { items, subtotal, discount, deliveryFee, grandTotal, prescriptionRequired, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // New address form
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    streetAddress: '',
    city: '',
    state: 'Karnataka',
    postalCode: '',
    landmark: '',
  });

  // Prescription file upload state
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [prescriptionId, setPrescriptionId] = useState(null);
  const [uploadingPrescription, setUploadingPrescription] = useState(false);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('TEST'); // 'TEST', 'RAZORPAY', 'COD'
  const [processingOrder, setProcessingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Redirect if cart is empty and no order placed
  useEffect(() => {
    if (items.length === 0 && !placedOrder) {
      navigate('/cart');
    }
  }, [items, placedOrder]);

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/address', newAddress);
      if (res.data.success) {
        setAddresses(res.data.data.addresses);
        setSelectedAddressIndex(res.data.data.addresses.length - 1);
        setShowNewAddressForm(false);
      } else {
        alert(res.data.message || 'Failed to save address');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving address');
    }
  };

  const handlePrescriptionUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size <= 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit');
      return;
    }

    const formData = new FormData();
    formData.append('prescription', file);

    try {
      setUploadingPrescription(true);
      const res = await api.post('/prescriptions/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setPrescriptionFile(file);
        setPrescriptionId(res.data.data.prescription._id);
      } else {
        alert(res.data.message || 'Prescription upload failed');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error uploading prescription file');
    } finally {
      setUploadingPrescription(false);
    }
  };

  const handlePlaceOrder = async () => {
    const shippingAddress = addresses[selectedAddressIndex];
    if (!shippingAddress) {
      alert('Please select or add a shipping address');
      return;
    }

    if (prescriptionRequired && !prescriptionId) {
      alert('One or more medicines require a prescription. Please upload a doctor prescription.');
      return;
    }

    try {
      setProcessingOrder(true);

      // 1. Create order on backend (recalculates prices & checks stock)
      const orderRes = await api.post('/orders', {
        shippingAddress,
        paymentMethod,
        prescriptionId,
      });

      if (!orderRes.data.success) {
        alert(orderRes.data.message || 'Failed to create order');
        return;
      }

      const order = orderRes.data.data.order;

      // 2. Handle Payment Flow
      if (paymentMethod === 'TEST') {
        // Fast verified test payment
        const payRes = await api.post('/payments/verify', {
          orderId: order._id,
          isTestPayment: true,
        });

        if (payRes.data.success) {
          setPlacedOrder(payRes.data.data.order);
          clearCart();
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }
      } else if (paymentMethod === 'COD') {
        // Cash on delivery
        setPlacedOrder(order);
        clearCart();
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } else {
        // Live Razorpay intent flow
        const intentRes = await api.post('/payments/create-intent', { orderId: order._id });
        if (intentRes.data.success) {
          // In dev without live Razorpay script loaded, simulate verification
          const verifyRes = await api.post('/payments/verify', {
            orderId: order._id,
            isTestPayment: true,
          });
          setPlacedOrder(verifyRes.data.data.order);
          clearCart();
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Order placement failed');
    } finally {
      setProcessingOrder(false);
    }
  };

  // If order is completed, show Order Confirmation view
  if (placedOrder) {
    return (
      <div className="py-10 max-w-2xl mx-auto space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Order Confirmed!
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Thank you for ordering with MediCare Pharmacy. Your order has been placed and received by our licensed dispensary team.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2 max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-500">Order Number:</span>
              <strong className="text-slate-900 font-mono">#{placedOrder.orderNumber}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Order Status:</span>
              <span className="text-teal-700 font-bold">{placedOrder.orderStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Status:</span>
              <span className="text-emerald-700 font-bold">{placedOrder.paymentStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Amount:</span>
              <strong className="text-slate-900">{formatCurrency(placedOrder.total)}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estimated Delivery:</span>
              <span className="text-slate-900 font-semibold">Within 24 to 48 Hours</span>
            </div>
          </div>

          {placedOrder.prescriptionRequired && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 text-left max-w-md mx-auto flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Prescription Review:</strong> Your order contains prescription medication. Our pharmacist will verify your prescription before dispatch.
              </span>
            </div>
          )}

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={`/orders/${placedOrder._id}`}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition"
            >
              Track Order Real-Time
            </Link>
            <Link
              to="/medicines"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Secure Medical Checkout
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Delivery address, prescription verification, and payment processing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Checkout Steps Form */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Delivery Address */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>1. Delivery Address</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add New Address
              </button>
            </div>

            {/* Saved Addresses Selector */}
            {addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((addr, idx) => (
                  <div
                    key={addr._id || idx}
                    onClick={() => setSelectedAddressIndex(idx)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                      selectedAddressIndex === idx
                        ? 'border-teal-600 bg-teal-50/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="text-xs space-y-1">
                      <div className="font-bold text-slate-900 flex items-center justify-between">
                        <span>{addr.fullName}</span>
                        {selectedAddressIndex === idx && (
                          <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        )}
                      </div>
                      <div className="text-slate-600">{addr.streetAddress}</div>
                      <div className="text-slate-600">
                        {addr.city}, {addr.state} - <strong className="text-slate-900">{addr.postalCode}</strong>
                      </div>
                      <div className="text-slate-500 pt-1">Phone: {addr.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No saved addresses yet. Please fill out the form below.</p>
            )}

            {/* Inline Add Address Form */}
            {(showNewAddressForm || addresses.length === 0) && (
              <form onSubmit={handleAddNewAddress} className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-800">Add New Shipping Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={newAddress.streetAddress}
                      onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Postal PIN Code</label>
                    <input
                      type="text"
                      required
                      pattern="^[1-9][0-9]{5}$"
                      placeholder="e.g. 560034"
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewAddressForm(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-teal-600 text-white hover:bg-teal-700"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Step 2: Prescription Upload (If required) */}
          {prescriptionRequired && (
            <div className="bg-white border-2 border-rose-200 rounded-2xl p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                <h2 className="text-sm font-bold text-rose-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-rose-600" />
                  <span>2. Upload Doctor's Prescription (Required)</span>
                </h2>
                <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Mandatory for Rx
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                As per statutory pharmaceutical guidelines, medications in your order require a valid doctor's prescription. Please upload a clear photo or PDF scan showing patient name and doctor credentials.
              </p>

              <div className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-6 text-center bg-slate-50 transition cursor-pointer relative">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handlePrescriptionUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />

                {uploadingPrescription ? (
                  <div className="flex flex-col items-center justify-center space-y-2 text-teal-600">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-xs font-semibold">Uploading and scanning file...</span>
                  </div>
                ) : prescriptionFile ? (
                  <div className="flex flex-col items-center justify-center space-y-1 text-emerald-700">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    <span className="text-xs font-bold">{prescriptionFile.name}</span>
                    <span className="text-[11px] text-slate-500">File uploaded and attached to order</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2 text-slate-500">
                    <UploadCloud className="w-8 h-8 text-slate-400" />
                    <div className="text-xs font-semibold text-slate-700">
                      Click to upload prescription (JPG, PNG, PDF up to 5MB)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Our certified pharmacist will review this before dispatch
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Payment Method */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <CreditCard className="w-4 h-4 text-teal-600" />
              <span>{prescriptionRequired ? '3' : '2'}. Select Payment Method</span>
            </h2>

            <div className="space-y-3">
              <label
                onClick={() => setPaymentMethod('TEST')}
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition ${
                  paymentMethod === 'TEST'
                    ? 'border-teal-600 bg-teal-50/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'TEST'}
                    onChange={() => setPaymentMethod('TEST')}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Simulated Instant Online Payment (Demo / UPI / Card)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Instant backend HMAC payment verification without entering real financial details
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Recommended
                </span>
              </label>

              <label
                onClick={() => setPaymentMethod('COD')}
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition ${
                  paymentMethod === 'COD'
                    ? 'border-teal-600 bg-teal-50/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Cash on Delivery (COD)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Pay with cash or UPI to the delivery courier upon arrival
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Summary Box */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 sticky top-24">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
            Order Review
          </h3>

          <div className="space-y-2.5 max-h-56 overflow-y-auto divide-y divide-slate-100 pr-1">
            {items.map((it) => (
              <div key={it._id} className="pt-2 flex items-center justify-between text-xs">
                <div className="truncate pr-2">
                  <span className="font-semibold text-slate-800 block truncate">{it.medicine.name}</span>
                  <span className="text-slate-400 text-[11px]">Qty: {it.quantity}</span>
                </div>
                <span className="font-bold text-slate-900">{formatCurrency(it.itemTotal)}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-bold text-slate-900">
              <span>Total Payable</span>
              <span className="text-teal-700">{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={processingOrder || (prescriptionRequired && !prescriptionId)}
            className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition"
          >
            {processingOrder ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Verifying Order & Payment...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" /> Place Order ({formatCurrency(grandTotal)})
              </>
            )}
          </button>

          {prescriptionRequired && !prescriptionId && (
            <p className="text-[11px] text-rose-600 text-center font-medium">
              * Please upload your prescription above to enable order placement
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
