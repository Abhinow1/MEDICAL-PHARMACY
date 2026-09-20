import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  ExternalLink, 
  Check, 
  X, 
  AlertTriangle,
  Clock,
  User,
  Eye
} from 'lucide-react';
import PrescriptionModal from '../../components/admin/PrescriptionModal';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

const AdminPrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedRx, setSelectedRx] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, [statusFilter]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);

      const res = await api.get(`/admin/prescriptions?${params.toString()}`);
      if (res.data.success) {
        setPrescriptions(res.data.data.prescriptions || []);
      }
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Prescription Verification Queue
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verify doctor prescriptions for Schedule H and Rx-required medicines prior to order dispatch
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <span className="text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 shadow-sm"
          >
            <option value="ALL">All Documents</option>
            <option value="PENDING">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Prescription Cards / Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Uploaded File</th>
                <th className="py-3 px-3">Patient</th>
                <th className="py-3 px-3">Associated Order</th>
                <th className="py-3 px-3 text-center">Review Status</th>
                <th className="py-3 px-3">Verification Notes</th>
                <th className="py-3 px-4 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-400">Loading prescription queue...</td>
                </tr>
              ) : prescriptions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-400">No prescriptions found for this filter.</td>
                </tr>
              ) : (
                prescriptions.map((rx) => (
                  <tr key={rx._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 truncate max-w-[180px]">
                            {rx.originalName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {formatDate(rx.createdAt)} • {(rx.size / 1024).toFixed(0)} KB
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{rx.user?.name || 'Customer'}</div>
                      <div className="text-[11px] text-slate-500">{rx.user?.phone}</div>
                    </td>
                    <td className="py-3 px-3">
                      {rx.order ? (
                        <div>
                          <span className="font-mono font-bold text-slate-900">#{rx.order.orderNumber}</span>
                          <div className="text-[10px] text-teal-700 font-semibold">{rx.order.orderStatus}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Standalone Upload</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        rx.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rx.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rx.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                      {rx.adminNotes || '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedRx(rx)}
                        className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold transition flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect Document
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedRx && (
        <PrescriptionModal
          prescription={selectedRx}
          onClose={() => setSelectedRx(null)}
          onReviewed={() => fetchPrescriptions()}
        />
      )}
    </div>
  );
};

export default AdminPrescriptionsPage;
