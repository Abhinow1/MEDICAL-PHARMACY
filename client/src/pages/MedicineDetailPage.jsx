import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Check, 
  FileText, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowLeft, 
  MessageCircle, 
  Share2, 
  Plus, 
  Minus,
  Sparkles,
  Truck,
  RotateCcw
} from 'lucide-react';
import MedicineCard from '../components/MedicineCard';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, createWhatsAppUrl } from '../utils/formatters';

const MedicineDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [medicine, setMedicine] = useState(null);
  const [related, setRelated] = useState([]);
  const [substitutes, setSubstitutes] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/medicines/${id}`);
        if (res.data.success) {
          const medData = res.data.data.medicine;
          setMedicine(medData);
          setRelated(res.data.data.related || []);
          setQuantity(1);

          // Fetch Indian generic substitutes for active chemical molecule
          const salt = medData?.genericName || medData?.name;
          if (salt) {
            fetchSubstitutes(salt);
          }
        }
      } catch (err) {
        console.error('Failed to load medicine details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchSubstitutes = async (salt) => {
    try {
      setLoadingSubs(true);
      const subRes = await api.get('/external-medicines/substitutes', {
        params: { generic: salt },
      });
      if (subRes.data.success) {
        setSubstitutes(subRes.data.data.substitutes || []);
      }
    } catch (err) {
      console.warn('Could not fetch Indian generic substitutes:', err);
    } finally {
      setLoadingSubs(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 max-w-5xl mx-auto space-y-6">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="bg-white border border-slate-200 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
          <div className="aspect-square bg-slate-100 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-100 rounded w-1/2" />
            <div className="h-20 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Medicine not found</h2>
        <Link to="/medicines" className="inline-block px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = medicine.stock <= 0;
  const isLowStock = medicine.stock > 0 && medicine.stock <= (medicine.lowStockThreshold || 15);
  const finalUnitPrice = medicine.discount > 0
    ? medicine.price - (medicine.price * medicine.discount) / 100
    : medicine.price;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    setAdding(true);
    const res = await addToCart(medicine._id, quantity);
    setAdding(false);

    if (res.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } else {
      alert(res.message || 'Could not add to cart');
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent('/checkout'));
      return;
    }

    const res = await addToCart(medicine._id, quantity);
    if (res.success) {
      navigate('/checkout');
    } else {
      alert(res.message || 'Could not proceed to checkout');
    }
  };

  return (
    <div className="py-4 sm:py-6 space-y-8 sm:space-y-12 max-w-6xl mx-auto pb-32 sm:pb-12">
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </button>
      </div>

      {/* Main Details Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left: Image */}
        <div className="md:col-span-5 bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center relative">
          {medicine.prescriptionRequired && (
            <div className="absolute top-3 left-3 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
              <FileText className="w-3.5 h-3.5" /> Doctor Prescription Required
            </div>
          )}

          <img
            src={medicine.image}
            alt={medicine.name}
            className="w-full max-h-80 object-contain"
          />

          <div className="mt-4 text-center text-xs text-slate-400">
            {medicine.packSize} • {medicine.dosageForm}
          </div>
        </div>

        {/* Right: Info & Purchase Controls */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold uppercase tracking-wider text-teal-700">
                {medicine.category?.name || 'Pharmacy Item'}
              </span>
              <span>Brand: <strong className="text-slate-800">{medicine.brand}</strong></span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {medicine.name}
            </h1>

            <div className="text-xs text-slate-500 italic mt-1">
              Active Salt / Generic Name: <span className="font-semibold text-slate-700 not-italic">{medicine.genericName}</span>
            </div>

            {/* Price section */}
            <div className="mt-4 flex items-baseline gap-3">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                {formatCurrency(finalUnitPrice)}
              </div>
              {medicine.discount > 0 && (
                <>
                  <div className="text-sm text-slate-400 line-through">
                    {formatCurrency(medicine.price)}
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {medicine.discount}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="text-[11px] text-slate-400 mt-1">
              Inclusive of all taxes • MRP per pack
            </div>

            {/* Stock Status */}
            <div className="mt-3">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5" /> Only {medicine.stock} units remaining in dispensary
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> In Stock & Ready to Dispatch
                </span>
              )}
            </div>

            {/* Uses Tags */}
            {medicine.uses && medicine.uses.length > 0 && (
              <div className="mt-5">
                <span className="text-xs font-bold text-slate-700 block mb-2">Common Medical Uses:</span>
                <div className="flex flex-wrap gap-1.5">
                  {medicine.uses.map((use, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                    >
                      {use}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mt-5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <h3 className="font-bold text-slate-800 text-xs mb-1">Product Description</h3>
              <p>{medicine.description}</p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            {/* Quantity Stepper */}
            {!isOutOfStock && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(medicine.stock, q + 1))}
                    disabled={quantity >= medicine.stock}
                    className="p-2 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-slate-400">
                  Total: {formatCurrency(finalUnitPrice * quantity)}
                </span>
              </div>
            )}

            {/* Buttons: Add to Cart, Buy Now, WhatsApp */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || adding}
                className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
                  isOutOfStock
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white border border-teal-200'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" /> Added to Cart
                  </>
                ) : adding ? (
                  'Adding...'
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </>
                )}
              </button>

              {!isOutOfStock && (
                <button
                  onClick={handleBuyNow}
                  className="flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition"
                >
                  Buy Now
                </button>
              )}

              {/* WhatsApp specific medicine inquiry */}
              <a
                href={createWhatsAppUrl(`Hello Pharmacist, I would like to know about ${medicine.name} (${medicine.brand}) priced at ₹${finalUnitPrice}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition flex items-center gap-1.5 text-xs font-semibold"
                title="Inquire on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                <span className="hidden sm:inline">Ask Pharmacist</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Indian Generic Substitutes & Cost Comparison */}
      {substitutes.length > 0 && (
        <section className="bg-white border border-teal-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold tracking-wide uppercase">
                  Indian Generic Directory
                </span>
                <span className="text-xs text-slate-400">• CDSCO Equivalent Formulations</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                Indian Generic Substitutes & Price Comparison
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Accredited Indian alternatives containing identical active therapeutic salt (<strong className="text-slate-800 font-semibold">{medicine.genericName || medicine.name}</strong>).
              </p>
            </div>
            <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl self-start sm:self-auto font-medium">
              <span className="font-bold text-teal-700">{substitutes.length}</span> generic options
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {substitutes.map((sub, idx) => {
              const priceDiff = finalUnitPrice - sub.mrp;
              const savingsPercent = finalUnitPrice > 0 && priceDiff > 0 
                ? Math.round((priceDiff / finalUnitPrice) * 100) 
                : 0;

              return (
                <div 
                  key={idx} 
                  className="bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        sub.schedule === 'OTC' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : sub.schedule === 'Schedule H1'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sub.schedule || 'Schedule H'}
                      </span>
                      {savingsPercent > 5 && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-600 text-white">
                          Save {savingsPercent}%
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm">{sub.brandName}</h3>
                    <p className="text-xs text-teal-700 font-medium mt-0.5">{sub.manufacturer}</p>

                    <div className="mt-2 text-[11px] text-slate-600 space-y-1">
                      <div><strong className="text-slate-700">Composition:</strong> {sub.genericComposition}</div>
                      <div><strong className="text-slate-700">Pack:</strong> {sub.packSize} • {sub.dosageForm}</div>
                      {sub.therapeuticClass && (
                        <div><strong className="text-slate-700">Class:</strong> {sub.therapeuticClass}</div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">MRP (INR)</span>
                      <span className="text-sm font-extrabold text-slate-900">₹{sub.mrp.toFixed(2)}</span>
                    </div>

                    <a
                      href={createWhatsAppUrl(`Hello Pharmacist, is the Indian generic substitute "${sub.brandName}" (${sub.manufacturer}) priced at ₹${sub.mrp} available?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition text-xs font-semibold flex items-center gap-1"
                      title="Inquire about this substitute"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Ask Pharmacist</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Mandatory Statutory Medical Disclaimer Banner */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 flex items-start gap-3 text-xs text-amber-800">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="block text-amber-900 font-bold mb-0.5">Statutory Disclaimer:</strong>
          This information is for product reference only and does not replace professional medical advice, diagnosis, or treatment. Never disregard or delay seeking medical advice because of something you have read on this website. Always administer medication strictly under the supervision of a licensed healthcare practitioner.
        </div>
      </div>

      {/* Related Medicines in Category */}
      {related.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Related Medicines in {medicine.category?.name || 'Category'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((rel) => (
              <MedicineCard key={rel._id} medicine={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Mobile Sticky Bottom Purchase Bar */}
      <div className="md:hidden fixed bottom-14 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg pb-[calc(0.4rem+env(safe-area-inset-bottom,0px))]">
        <div>
          <span className="text-[10px] text-slate-400 block font-semibold leading-tight">Total Price</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-slate-900">
              {formatCurrency(finalUnitPrice * quantity)}
            </span>
            {medicine.discount > 0 && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">
                {medicine.discount}% OFF
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isOutOfStock && (
            <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden h-9">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="px-2.5 text-slate-600 active:bg-slate-200 disabled:opacity-40 h-full flex items-center justify-center"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-2 text-xs font-bold text-slate-900">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(medicine.stock, q + 1))}
                disabled={quantity >= medicine.stock}
                className="px-2.5 text-slate-600 active:bg-slate-200 disabled:opacity-40 h-full flex items-center justify-center"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
            className={`h-9 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95 ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : added
                ? 'bg-emerald-600 text-white'
                : 'bg-[#0c3c2f] hover:bg-[#144d3d] text-white'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : adding ? (
              'Adding...'
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetailPage;
