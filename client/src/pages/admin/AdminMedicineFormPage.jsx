import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, FileText, Check, AlertCircle, Pill, Search, Sparkles } from 'lucide-react';
import api from '../../services/api';

const AdminMedicineFormPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [autofillSearch, setAutofillSearch] = useState('');
  const [autofillSuggestions, setAutofillSuggestions] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    brand: '',
    category: '',
    description: '',
    uses: '',
    price: '',
    costPrice: '',
    discount: '0',
    stock: '50',
    lowStockThreshold: '15',
    prescriptionRequired: false,
    dosageForm: 'Tablet',
    strength: '',
    packSize: '10 Tablets',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60',
    isActive: true,
  });

  useEffect(() => {
    const init = async () => {
      try {
        const catRes = await api.get('/medicines/categories');
        if (catRes.data.success) {
          setCategories(catRes.data.data.categories || []);
          if (!isEditing && catRes.data.data.categories?.length > 0) {
            setFormData((prev) => ({ ...prev, category: catRes.data.data.categories[0]._id }));
          }
        }

        if (isEditing) {
          const medRes = await api.get(`/medicines/${id}`);
          if (medRes.data.success) {
            const m = medRes.data.data.medicine;
            setFormData({
              name: m.name || '',
              genericName: m.genericName || '',
              brand: m.brand || '',
              category: m.category?._id || '',
              description: m.description || '',
              uses: Array.isArray(m.uses) ? m.uses.join(', ') : m.uses || '',
              price: m.price?.toString() || '',
              costPrice: m.costPrice?.toString() || '',
              discount: m.discount?.toString() || '0',
              stock: m.stock?.toString() || '0',
              lowStockThreshold: m.lowStockThreshold?.toString() || '15',
              prescriptionRequired: Boolean(m.prescriptionRequired),
              dosageForm: m.dosageForm || 'Tablet',
              strength: m.strength || '',
              packSize: m.packSize || '10 Tablets',
              image: m.image || '',
              isActive: m.isActive !== undefined ? m.isActive : true,
            });
          }
        }
      } catch (err) {
        console.error('Failed to initialize medicine form:', err);
      } finally {
        setFetching(false);
      }
    };

    init();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAutofillSearch = async (e) => {
    const val = e.target.value;
    setAutofillSearch(val);
    if (!val || val.trim().length < 2) {
      setAutofillSuggestions([]);
      return;
    }

    try {
      const res = await api.get('/external-medicines/search', {
        params: { query: val.trim(), limit: 8 },
      });
      if (res.data.success) {
        setAutofillSuggestions(res.data.data.medicines || []);
      }
    } catch (err) {
      console.warn('Autofill lookup error:', err);
    }
  };

  const applyAutofill = (drug) => {
    setFormData((prev) => ({
      ...prev,
      name: drug.brandName,
      genericName: drug.genericComposition,
      brand: drug.manufacturer,
      description: `Official ${drug.brandName} manufactured by ${drug.manufacturer}. Therapeutic class: ${drug.therapeuticClass}. Contains ${drug.genericComposition}. Manufactured in compliance with CDSCO regulatory guidelines.`,
      uses: drug.therapeuticClass || '',
      price: Math.round(drug.mrp).toString(),
      costPrice: Math.round(drug.mrp * 0.65).toString(),
      discount: '10',
      dosageForm: drug.dosageForm,
      strength: drug.packSize,
      packSize: drug.packSize,
      prescriptionRequired: Boolean(drug.prescriptionRequired),
    }));
    setAutofillSearch('');
    setAutofillSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        costPrice: Number(formData.costPrice),
        discount: Number(formData.discount),
        stock: Number(formData.stock),
        lowStockThreshold: Number(formData.lowStockThreshold),
        uses: formData.uses.split(',').map((u) => u.trim()).filter(Boolean),
      };

      if (isEditing) {
        await api.put(`/admin/medicines/${id}`, payload);
      } else {
        await api.post('/admin/medicines', payload);
      }

      navigate('/admin/medicines');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save medicine');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="py-12 max-w-3xl mx-auto text-center text-xs text-slate-400">
        Loading medicine data for editing...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/admin/medicines')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2">
            {isEditing ? 'Edit Medicine' : 'Add New Medicine'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6 text-xs">
        {/* Indian Drug Directory Quick Autofill */}
        {!isEditing && (
          <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-teal-900 flex items-center gap-1.5 text-xs">
                <Pill className="w-4 h-4 text-teal-700" /> Autofill from Indian Drug Index (CDSCO)
              </span>
              <span className="text-[10px] text-teal-800 bg-teal-200/60 px-2 py-0.5 rounded-full font-bold">
                Quick Fill
              </span>
            </div>
            <p className="text-slate-600 text-[11px]">
              Search top Indian pharmaceutical brands (e.g. Dolo 650, Augmentin, Pan-D, Telma 40, Glycomet) to autofill name, active salt, manufacturer, pack size, and indicative prices.
            </p>
            <div className="relative">
              <input
                type="text"
                value={autofillSearch}
                onChange={handleAutofillSearch}
                placeholder="Type brand name to search (e.g. Dolo, Augmentin, Pan-D, Azithral)..."
                className="w-full bg-white border border-teal-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
              <Search className="w-4 h-4 text-teal-500 absolute left-3 top-2.5" />

              {/* Suggestions Dropdown */}
              {autofillSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 max-h-56 overflow-y-auto divide-y divide-slate-100">
                  {autofillSuggestions.map((sug, sIdx) => (
                    <div
                      key={sIdx}
                      onClick={() => applyAutofill(sug)}
                      className="p-3 hover:bg-teal-50 cursor-pointer transition flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{sug.brandName}</div>
                        <div className="text-[11px] text-slate-500">{sug.genericComposition} • {sug.manufacturer}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="font-black text-teal-700">₹{sug.mrp.toFixed(2)}</span>
                        <span className="block text-[10px] text-slate-400">{sug.packSize}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Basic Identification */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-teal-700 uppercase tracking-wider pb-2 border-b border-slate-100">
            1. Product Identification
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Product Commercial Name *</label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Dolo 650 Tablet"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Generic / Chemical Name *</label>
              <input
                type="text"
                required
                name="genericName"
                value={formData.genericName}
                onChange={handleChange}
                placeholder="e.g. Paracetamol"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Manufacturer / Brand *</label>
              <input
                type="text"
                required
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Micro Labs"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Category / Department *</label>
              <select
                required
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing, Cost & Stock */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-teal-700 uppercase tracking-wider pb-2 border-b border-slate-100">
            2. Financials & Inventory Controls
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 32"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Purchase / Cost Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                placeholder="e.g. 20"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <span className="text-[10px] text-slate-400">Used for P&L calculations</span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Discount (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                placeholder="0"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Available Stock Units *</label>
              <input
                type="number"
                min="0"
                required
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="50"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Low Stock Alert Threshold</label>
              <input
                type="number"
                min="0"
                name="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                placeholder="15"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Pack Size</label>
              <input
                type="text"
                name="packSize"
                value={formData.packSize}
                onChange={handleChange}
                placeholder="e.g. 10 Tablets / 100ml"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Clinical Specs & Image */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-teal-700 uppercase tracking-wider pb-2 border-b border-slate-100">
            3. Clinical Information & Prescriptions
          </h3>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Indications / Common Uses (Comma-separated)</label>
            <input
              type="text"
              name="uses"
              value={formData.uses}
              onChange={handleChange}
              placeholder="Fever, Headache, Pain Relief, Arthritic aches"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Clinical Description *</label>
            <textarea
              required
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description for patient guidance..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Prescription Flag & Active Status Checkboxes */}
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
              <input
                type="checkbox"
                name="prescriptionRequired"
                checked={formData.prescriptionRequired}
                onChange={handleChange}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <span className="text-rose-700">Mark as Prescription (Rx) Required</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Active in Storefront</span>
            </label>
          </div>
        </div>

        {/* Save Bar */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/medicines')}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : isEditing ? 'Update Medicine' : 'Save Medicine'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminMedicineFormPage;
