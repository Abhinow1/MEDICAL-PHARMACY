import React, { useState } from 'react';
import { X, Check, AlertTriangle, ExternalLink, FileText, User, Phone, Mail } from 'lucide-react';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

const PrescriptionModal = ({ prescription, onClose, onReviewed }) => {
  const [adminNotes, setAdminNotes] = useState(prescription.adminNotes || '');
  const [loading, setLoading] = useState(false);

  if (!prescription) return null;

  const handleReview = async (status) => {
    try {
      setLoading(true);
      const res = await api.put(`/admin/prescriptions/${prescription._id}/review`, {
        status,
        adminNotes,
      });

      if (res.data.success) {
        onReviewed(res.data.data.prescription);
        onClose();
      } else {
        alert(res.data.message || 'Review failed');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error reviewing prescription');
    } finally {
      setLoading(false);
    }
  };

  const isPdf = prescription.mimeType === 'application/pdf' || prescription.fileUrl.endsWith('.pdf');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-bold">Prescription Review Dispensary Queue</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* File View */}
          <div className="bg-slate-100 rounded-xl p-3 border border-slate-200 flex flex-col items-center justify-center min-h-[300px]">
            {isPdf ? (
              <div className="text-center p-6 space-y-3">
                <FileText className="w-16 h-16 text-rose-500 mx-auto" />
                <div className="text-xs font-semibold text-slate-700">
                  {prescription.originalName || 'Prescription_Document.pdf'}
                </div>
                <a
                  href={prescription.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open PDF Document
                </a>
              </div>
            ) : (
              <div className="space-y-2 text-center w-full">
                <img
                  src={prescription.fileUrl}
                  alt="Doctor Prescription"
                  className="max-h-[340px] w-auto mx-auto object-contain rounded-lg shadow-sm"
                />
                <a
                  href={prescription.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-teal-600 font-semibold hover:underline"
                >
                  <ExternalLink className="w-3 h-3" /> View full resolution
                </a>
              </div>
            )}
          </div>

          {/* Patient and Order Meta */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-teal-600" /> Patient Details
                </div>
                <div className="space-y-1 text-slate-600">
                  <p><strong>Name:</strong> {prescription.user?.name || 'Customer'}</p>
                  <p><strong>Email:</strong> {prescription.user?.email || '—'}</p>
                  <p><strong>Phone:</strong> {prescription.user?.phone || '—'}</p>
                  <p><strong>Uploaded:</strong> {formatDate(prescription.createdAt)}</p>
                </div>
              </div>

              {prescription.order && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">Associated Order</div>
                  <p className="text-slate-600">
                    Order Number: <strong className="text-slate-900">#{prescription.order.orderNumber}</strong>
                  </p>
                  <p className="text-slate-600">
                    Order Status: <span className="font-semibold text-teal-700">{prescription.order.orderStatus}</span>
                  </p>
                </div>
              )}

              {/* Pharmacist Review Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pharmacist Verification Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Valid doctor signature, registered MCI license, correct dosage verified..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleReview('REJECTED')}
                disabled={loading}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition flex items-center gap-1"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Reject Prescription
              </button>
              <button
                type="button"
                onClick={() => handleReview('APPROVED')}
                disabled={loading}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 transition flex items-center gap-1 shadow-sm"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Approve Prescription
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModal;
