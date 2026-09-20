import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Store, 
  MessageCircle, 
  ShieldCheck, 
  Clock, 
  FileText,
  Save,
  CheckCircle2
} from 'lucide-react';
import api from '../../services/api';
import { formatDateTime } from '../../utils/formatters';

const AdminSettingsPage = () => {
  const [storeName, setStoreName] = useState('MediCare Pharmacy');
  const [whatsappNumber, setWhatsappNumber] = useState('919876543210');
  const [drugLicense, setDrugLicense] = useState('DL-KA-BNG-2024-88491');
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState('500');
  const [deliveryFee, setDeliveryFee] = useState('40');
  const [auditLogs, setAuditLogs] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/admin/audit-logs');
        if (res.data.success) {
          setAuditLogs(res.data.data.logs || []);
        }
      } catch (err) {
        console.error('Failed to load audit logs:', err);
      }
    };
    fetchLogs();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Store Operations & System Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure pharmacy business parameters, drug license data, and view audit trail
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-xs">
        <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
          <Store className="w-4 h-4 text-teal-600" /> Pharmacy Business Configuration
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Pharmacy Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Official WhatsApp Phone Number</label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="e.g. 919876543210 (Country code + number)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <span className="text-[10px] text-slate-400">Used for customer WhatsApp Click-to-Chat links</span>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">State Drug License Number</label>
            <input
              type="text"
              value={drugLicense}
              onChange={(e) => setDrugLicense(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Free Delivery Minimum Order (₹)</label>
            <input
              type="number"
              value={freeDeliveryThreshold}
              onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> Settings Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Settings
              </>
            )}
          </button>
        </div>
      </form>

      {/* Admin Audit Trail */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Regulatory Compliance & Administrative Audit Log</span>
        </h2>
        <p className="text-xs text-slate-500">
          Immutable log of product price modifications, stock changes, order status transitions, and user deactivations
        </p>

        <div className="overflow-x-auto max-h-72 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider sticky top-0">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Administrator</th>
                <th className="py-2.5 px-3">Operation / Event</th>
                <th className="py-2.5 px-3">Target Entity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-slate-400">
                    No recent audit events logged.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 text-slate-500">{formatDateTime(log.createdAt)}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{log.adminEmail || log.admin?.email}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-teal-700 font-bold">{log.action}</td>
                    <td className="py-2.5 px-3 text-slate-600">{log.entity} #{log.entityId?.slice(-6)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
