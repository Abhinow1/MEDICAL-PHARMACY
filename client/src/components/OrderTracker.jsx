import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  FileText, 
  Package, 
  Truck, 
  Home, 
  AlertCircle,
  CreditCard 
} from 'lucide-react';

const OrderTracker = ({ order }) => {
  const currentStatus = order?.orderStatus || 'PENDING';
  const isCancelled = currentStatus === 'CANCELLED';
  const isRefunded = currentStatus === 'REFUNDED';

  if (isCancelled || isRefunded) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3 text-rose-800">
        <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-bold">Order {isRefunded ? 'Refunded' : 'Cancelled'}</h4>
          <p className="text-xs text-rose-600 mt-0.5">
            This order has been {isRefunded ? 'fully refunded' : 'cancelled'}. If you have questions or need further assistance, please reach out to our pharmacy support.
          </p>
        </div>
      </div>
    );
  }

  // Base milestones
  const steps = [
    { key: 'PLACED', label: 'Order Placed', icon: Clock },
    ...(order?.prescriptionRequired
      ? [{ key: 'PRESCRIPTION', label: 'Prescription Verified', icon: FileText }]
      : []),
    { key: 'PAID', label: 'Payment Confirmed', icon: CreditCard },
    { key: 'PROCESSING', label: 'Processing & Packed', icon: Package },
    { key: 'SHIPPED', label: 'Shipped', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: Home },
  ];

  // Helper to determine active step index
  const getActiveStepIndex = () => {
    switch (currentStatus) {
      case 'PENDING':
      case 'PAYMENT_PENDING':
        return 0;
      case 'PRESCRIPTION_PENDING':
        return order?.prescriptionRequired ? 0 : 0;
      case 'PRESCRIPTION_APPROVED':
        return order?.prescriptionRequired ? 1 : 0;
      case 'PAID':
        return order?.prescriptionRequired ? 2 : 1;
      case 'PROCESSING':
      case 'PACKED':
        return order?.prescriptionRequired ? 3 : 2;
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return order?.prescriptionRequired ? 4 : 3;
      case 'DELIVERED':
        return order?.prescriptionRequired ? 5 : 4;
      default:
        return 0;
    }
  };

  const activeIndex = getActiveStepIndex();

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
            Order Status
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-1.5 flex items-center gap-2">
            <span>{currentStatus.replace(/_/g, ' ')}</span>
            {currentStatus === 'DELIVERED' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            )}
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 block">Est. Delivery</span>
          <span className="text-sm font-semibold text-slate-800">Within 24-48 Hours</span>
        </div>
      </div>

      {/* Visual Step Progress */}
      <div className="relative">
        <div className="hidden sm:block absolute top-1/2 left-4 right-4 h-1 bg-slate-200 -translate-y-1/2 -z-0">
          <div
            className="h-full bg-teal-600 transition-all duration-500"
            style={{
              width: `${(activeIndex / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 md:grid-cols-6 gap-4 relative z-10">
          {steps.map((step, idx) => {
            const isCompleted = idx <= activeIndex;
            const isCurrent = idx === activeIndex;
            const IconComp = step.icon;

            return (
              <div
                key={step.key}
                className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-teal-600 text-white shadow-sm ring-4 ring-teal-50'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  {isCompleted && !isCurrent ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <IconComp className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div
                    className={`text-xs font-semibold ${
                      isCurrent
                        ? 'text-teal-700 font-bold'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </div>
                  {isCurrent && (
                    <span className="text-[10px] text-teal-600 font-medium block">
                      In progress
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prescription Notice if pending review */}
      {currentStatus === 'PRESCRIPTION_PENDING' && (
        <div className="mt-5 p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2.5">
          <FileText className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Prescription Review Underway:</strong> Our certified dispensary pharmacist is reviewing your doctor's prescription. Once approved, your order will proceed directly to packaging and shipping.
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracker;
