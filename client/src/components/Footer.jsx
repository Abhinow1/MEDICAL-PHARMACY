import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, ShieldAlert, PhoneCall, Clock, MapPin, MessageCircle } from 'lucide-react';
import { createWhatsAppUrl } from '../utils/formatters';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-16 border-t border-slate-800">
      {/* Important Medical Disclaimer Banner */}
      <div className="bg-amber-950/40 border-b border-amber-800/30 text-amber-300/90 py-3.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
          <p className="leading-relaxed">
            <strong>Mandatory Medical Disclaimer:</strong> Information and products listed on St Mary's Pharmacy are intended strictly for informational and retail reference purposes. This website does not offer clinical diagnosis or personalized medical treatment. Always consult a licensed medical doctor or certified healthcare practitioner before starting any medication.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Store Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <PlusCircle className="w-5 h-5" />
              </div>
              <span className="text-white font-bold text-base tracking-tight">St Mary's Pharmacy</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your registered, certified community pharmacy delivering authentic medicines, chronic health supplies, and wellness essentials with speed and care.
            </p>
            <div className="text-[11px] text-slate-500 pt-1">
              Drug License: <span className="text-slate-300 font-mono">DL-KA-BNG-2024-88491</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Explore Catalog</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/medicines?category=pain-relief" className="hover:text-teal-400 transition">Pain Relief & Fever</Link></li>
              <li><Link to="/medicines?category=cold-and-flu" className="hover:text-teal-400 transition">Cold, Cough & Flu</Link></li>
              <li><Link to="/medicines?category=diabetes-care" className="hover:text-teal-400 transition">Diabetes Care & Monitoring</Link></li>
              <li><Link to="/medicines?category=vitamins" className="hover:text-teal-400 transition">Vitamins & Supplements</Link></li>
              <li><Link to="/medicines?category=first-aid" className="hover:text-teal-400 transition">First Aid & Bandages</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Customer Support</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/prescriptions" className="hover:text-teal-400 transition">Prescription Upload Guide</Link></li>
              <li><Link to="/orders" className="hover:text-teal-400 transition">Track Your Order</Link></li>
              <li><Link to="/contact" className="hover:text-teal-400 transition">Store Hours & Delivery</Link></li>
              <li>
                <a
                  href={createWhatsAppUrl('Hello St Mary\'s Pharmacy, I have an inquiry regarding a prescription order.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition flex items-center gap-1 text-emerald-500 font-medium"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Support
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Dispensary Details */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Dispensary Contact</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <span>#42 Healthcare Boulevard, 100ft Ring Road, Indiranagar, Bengaluru 560038</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>Mon – Sat: 8:00 AM – 10:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>Emergency Support: +91 98765 43210</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} St Mary's Pharmacy. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="hover:text-slate-400">Terms of Service</Link>
            <Link to="/contact" className="hover:text-slate-400">Privacy Policy</Link>
            <Link to="/admin/login" className="hover:text-teal-400 text-slate-600">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
