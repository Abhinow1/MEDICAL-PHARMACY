import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import api from '../services/api';
import { formatDate } from '../utils/formatters';

const PrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/prescriptions/my');
      if (res.data.success) {
        setPrescriptions(res.data.data.prescriptions || []);
      }
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit');
      return;
    }

    const formData = new FormData();
    formData.append('prescription', file);

    try {
      setUploading(true);
      const res = await api.post('/prescriptions/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        fetchPrescriptions();
        alert('Prescription uploaded successfully. Our pharmacist will review it.');
      } else {
        alert(res.data.message || 'Upload failed');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error uploading prescription');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Doctor Prescriptions
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Upload and track pharmacist review of doctor prescriptions for Rx medication fulfillment
        </p>
      </div>

      {/* Upload Zone */}
      <div className="bg-white border-2 border-dashed border-teal-300 hover:border-teal-500 rounded-3xl p-8 text-center transition cursor-pointer relative bg-teal-50/20">
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileUpload}
          disabled={uploading}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />

        {uploading ? (
          <div className="flex flex-col items-center justify-center space-y-2 text-teal-600">
            <Loader2 className="w-10 h-10 animate-spin" />
            <span className="text-xs font-semibold">Encrypting and uploading medical document...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                Click or drop new prescription file here
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Supports JPG, JPEG, PNG, and PDF formats up to 5MB. Verified by certified pharmacists under confidentiality protocols.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Prescriptions List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <FileText className="w-4 h-4 text-teal-600" />
          <span>Uploaded Prescription Records</span>
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : prescriptions.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">
            No prescriptions uploaded yet. You can attach a prescription here or directly during checkout.
          </p>
        ) : (
          <div className="space-y-3">
            {prescriptions.map((rx) => (
              <div
                key={rx._id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-teal-600 flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{rx.originalName}</div>
                    <div className="text-[11px] text-slate-500">
                      Uploaded on {formatDate(rx.createdAt)} • {(rx.size / 1024).toFixed(1)} KB
                    </div>
                    {rx.adminNotes && (
                      <div className="text-[11px] text-slate-600 mt-1 italic">
                        Pharmacist note: "{rx.adminNotes}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      rx.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rx.status === 'REJECTED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {rx.status}
                  </span>

                  <a
                    href={rx.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-teal-600 hover:underline font-semibold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> View File
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionsPage;
