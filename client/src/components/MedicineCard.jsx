import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Check, FileText, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';

const MedicineCard = ({ medicine }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);

  const isOutOfStock = medicine.stock <= 0;

  const discountedPrice = medicine.discount > 0
    ? medicine.price - (medicine.price * medicine.discount) / 100
    : medicine.price;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (isOutOfStock) return;

    setAdding(true);
    const res = await addToCart(medicine._id, 1);
    setAdding(false);

    if (res.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1600);
    } else {
      alert(res.message || 'Could not add medicine to cart');
    }
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
  };

  return (
    <div className="group bg-white border border-slate-100/90 rounded-2xl p-3.5 hover:shadow-lg hover:border-slate-200 transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        {/* Image Frame with Wishlist and Badges */}
        <div className="relative w-full h-44 sm:h-48 bg-[#f6f9f8] rounded-xl flex items-center justify-center p-3 overflow-hidden">
          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className="absolute top-2.5 right-2.5 z-10 w-8 h-8 sm:w-7 sm:h-7 rounded-full bg-white/90 hover:bg-white active:scale-90 flex items-center justify-center text-slate-400 hover:text-rose-500 shadow-xs transition"
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 transition ${liked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
          </button>

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
            {medicine.prescriptionRequired && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                <FileText className="w-2.5 h-2.5" /> Rx
              </span>
            )}
            {medicine.discount > 0 && (
              <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                {medicine.discount}% OFF
              </span>
            )}
          </div>

          <Link to={`/medicines/${medicine._id}`} className="w-full h-full flex items-center justify-center">
            <img
              src={medicine.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80'}
              alt={medicine.name}
              className="object-contain max-h-36 max-w-full drop-shadow-xs group-hover:scale-105 transition duration-300"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80';
              }}
            />
          </Link>
        </div>

        {/* Product Details */}
        <div className="pt-3 px-0.5">
          <Link to={`/medicines/${medicine._id}`} className="block">
            <h3 className="text-sm font-semibold text-slate-800 group-hover:text-forest-900 line-clamp-1 transition">
              {medicine.name}
            </h3>
          </Link>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mt-0.5">
            <span className="truncate">{medicine.brand || 'Healthcare'}</span>
            <span className="text-[10px] text-slate-400">{medicine.packSize}</span>
          </div>
        </div>
      </div>

      {/* Bottom Pricing & Add to Cart */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-slate-900">
            {formatCurrency(discountedPrice)}
          </span>
          {medicine.discount > 0 && (
            <span className="text-[11px] text-slate-400 line-through">
              {formatCurrency(medicine.price)}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || adding}
          className={`rounded-full px-3 py-1.5 min-h-[36px] text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 ${
            isOutOfStock
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              : added
              ? 'bg-[#0c3c2f] text-white border border-[#0c3c2f]'
              : 'bg-white hover:bg-[#0c3c2f] hover:text-white text-slate-700 border border-slate-200 hover:border-[#0c3c2f] shadow-xs'
          }`}
          title={isOutOfStock ? 'Out of stock' : 'Add to cart'}
        >
          {added ? (
            <>
              <Check className="w-3 h-3 stroke-[3]" />
              <span>Added</span>
            </>
          ) : adding ? (
            <span className="animate-spin inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full" />
          ) : (
            <span>Add to cart</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default MedicineCard;
