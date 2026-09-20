import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  MessageCircle, 
  FileText, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';
import CategoryList from '../components/CategoryList';
import MedicineCard from '../components/MedicineCard';
import api from '../services/api';
import { createWhatsAppUrl } from '../utils/formatters';

const featuredBrands = [
  { name: 'Cipla', tag: 'Certified' },
  { name: 'Sun Pharma', tag: 'Top Rated' },
  { name: 'Dr. Reddy\'s', tag: 'Global' },
  { name: 'Abbott', tag: 'Trusted' },
  { name: 'Pfizer', tag: 'Original' },
  { name: 'Mankind', tag: 'Affordable' },
  { name: 'Zydus', tag: 'Healthcare' },
  { name: 'GSK', tag: 'Verified' },
];

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [popularMedicines, setPopularMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [catRes, medRes] = await Promise.all([
          api.get('/medicines/categories'),
          api.get('/medicines/featured'),
        ]);

        if (catRes.data.success) {
          setCategories(catRes.data.data.categories || []);
        }
        if (medRes.data.success) {
          setPopularMedicines(medRes.data.data.medicines || []);
        }
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const topDeals = popularMedicines.slice(0, 4);
  const trendingProducts = popularMedicines.slice(0, 8);

  return (
    <div className="space-y-16 sm:space-y-24 py-4">
      {/* 1. Signature Hero Section */}
      <section className="bg-[#0c3c2f] text-white rounded-3xl relative overflow-hidden shadow-xl px-6 pt-10 pb-8 sm:px-12 sm:pt-14 sm:pb-12 max-w-7xl mx-auto">
        {/* Giant Lime Pharmacy Typography with Sparkles */}
        <div className="relative z-0 text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-4 text-[#8ee055] opacity-95">
            <span className="text-lg sm:text-3xl font-bold">✦</span>
            <h1 className="text-4xl min-[400px]:text-5xl sm:text-8xl md:text-9xl font-black tracking-tight uppercase select-none leading-none">
              Pharmacy
            </h1>
            <span className="text-lg sm:text-3xl font-bold">✦</span>
          </div>
        </div>

        {/* Hero Interactive Row: Copy + Doctor Photo */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left copy & CTA */}
          <div className="lg:col-span-7 flex flex-col justify-center gap-5 text-center lg:text-left">
            <p className="text-xs sm:text-base text-emerald-100/90 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Operational bottlenecks, frequent billing errors, and mismanaged schedules eliminated with direct certified pharmacy dispatch.
            </p>
            <div>
              <Link
                to="/medicines"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#0c3c2f] font-bold text-xs sm:text-sm hover:bg-slate-100 transition shadow-md group"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right: Doctor Visual */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <div className="relative w-60 sm:w-72 h-64 sm:h-80 overflow-hidden rounded-3xl shadow-2xl border-4 border-[#124b3b]">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80"
                alt="Licensed Pharmacist"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0c3c2f] via-transparent to-transparent h-16" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Categories Section */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0c3c2f] text-center tracking-tight mb-8">
          Popular Categories
        </h2>
        <CategoryList categories={categories} variant="circles" />
      </section>

      {/* 3. Todays Best Deals For You! */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0c3c2f] tracking-tight">
              Todays Best Deals For You!
            </h2>
            <p className="text-xs text-slate-500 mt-1">Special pharmacy prices on chronic care and daily essentials</p>
          </div>
          <Link
            to="/medicines"
            className="text-xs font-bold text-[#0c3c2f] hover:underline flex items-center gap-1 group"
          >
            <span>See all product</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {topDeals.map((medicine) => (
              <MedicineCard key={medicine._id} medicine={medicine} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Dual Promo Banners */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto px-4">
        {/* Banner 1: Vitamin D3 (Dark Forest Green) */}
        <div className="bg-[#0c3c2f] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm relative overflow-hidden group">
          <div className="w-32 h-36 sm:w-40 sm:h-44 flex items-center justify-center flex-shrink-0 bg-white/10 rounded-2xl p-3">
            <img
              src="https://images.unsplash.com/photo-1576602976047-174e57a47881?w=500&auto=format&fit=crop&q=80"
              alt="Sundown naturals Vitamin -D3"
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
            />
          </div>
          <div className="flex flex-col justify-between h-full">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#8ee055]">Nutritional Care</span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight mt-1 text-white">
                Sundown naturals Vitamin -D3
              </h3>
              <p className="text-xs text-emerald-100/80 mt-2 leading-relaxed">
                100% genuine vitamin supplement for enhanced calcium absorption and daily immunity.
              </p>
            </div>
            <div className="mt-5">
              <Link
                to="/medicines?search=Vitamin"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#fef08a] text-slate-900 font-bold text-xs hover:bg-yellow-300 transition shadow-sm"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Banner 2: Operational Optimization / Pharmacist Verification (Soft Lilac) */}
        <div className="bg-[#f3e8ff] text-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm relative overflow-hidden group">
          <div className="w-32 h-36 sm:w-40 sm:h-44 flex items-center justify-center flex-shrink-0 bg-white/80 rounded-2xl p-2 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80"
              alt="Licensed Pharmacist"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
            />
          </div>
          <div className="flex flex-col justify-between h-full">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-purple-700">Clinical Support</span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight mt-1 text-slate-900">
                Operational Optimization
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Upload your doctor's prescription for rapid pharmacist review, or connect with our dispensary team 24/7.
              </p>
            </div>
            <div className="mt-5">
              <Link
                to="/prescriptions"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-slate-900 font-bold text-xs hover:bg-slate-50 border border-purple-200 transition shadow-xs"
              >
                <span>Upload Prescription</span>
                <ArrowRight className="w-3 h-3 text-purple-700" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Our Featured Brands Section */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0c3c2f] text-center tracking-tight mb-8">
          Our Featured Brands
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
          {featuredBrands.map((brand) => (
            <Link
              key={brand.name}
              to={`/medicines?search=${encodeURIComponent(brand.name)}`}
              className="px-6 py-3 rounded-full bg-white border border-slate-200 hover:border-[#0c3c2f] hover:shadow-sm transition-all duration-200 flex items-center gap-2 group"
            >
              <span className="w-2 h-2 rounded-full bg-[#0c3c2f] group-hover:bg-[#8ee055] transition" />
              <span className="text-xs font-bold text-slate-800 group-hover:text-[#0c3c2f] transition">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. Our Trending Product Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0c3c2f] text-center tracking-tight mb-2">
          Our Trending Product
        </h2>
        <p className="text-xs text-slate-500 text-center mb-8">
          Most ordered medications and daily wellness supplements
        </p>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {trendingProducts.map((medicine) => (
              <MedicineCard key={medicine._id} medicine={medicine} />
            ))}
          </div>
        )}

        {/* Centered 'More Product >' Pill Button */}
        <div className="mt-10 text-center">
          <Link
            to="/medicines"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-slate-300 text-slate-800 font-bold text-xs hover:bg-[#0c3c2f] hover:text-white hover:border-[#0c3c2f] transition shadow-xs group"
          >
            <span>More Product</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 8. WhatsApp & Prescription Quick Help */}
      <section className="max-w-4xl mx-auto bg-emerald-50/80 border border-emerald-200/80 rounded-3xl p-8 text-center shadow-xs">
        <div className="w-12 h-12 bg-[#0c3c2f] text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow">
          <MessageCircle className="w-6 h-6 fill-emerald-100 text-[#0c3c2f]" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Need Help Finding a Specific Medicine?
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Send a photo of your prescription or medicine box directly to our licensed pharmacy team on WhatsApp.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={createWhatsAppUrl('Hello Pharmacist, I need help finding a medicine on MediCare.')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0c3c2f] hover:bg-[#144d3d] text-white font-bold text-xs shadow-sm transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
          <Link
            to="/prescriptions"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-300 transition"
          >
            <FileText className="w-4 h-4 text-[#0c3c2f]" />
            <span>Upload Doctor Prescription</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
