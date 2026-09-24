import React from 'react';
import { 
  PhoneCall, 
  Clock, 
  MapPin, 
  Mail, 
  MessageCircle, 
  ShieldAlert, 
  HelpCircle,
  Building2
} from 'lucide-react';
import { createWhatsAppUrl } from '../utils/formatters';

const ContactPage = () => {
  return (
    <div className="py-6 max-w-5xl mx-auto space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Pharmacy Dispensary & Customer Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Have questions regarding medicine stock, prescription validation, or orders? Our certified healthcare staff is here to help.
        </p>
      </div>

      {/* Emergency Alert Banner */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-start gap-3 text-xs text-rose-900">
        <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="block font-bold text-sm mb-0.5">Medical Emergency Notice:</strong>
          St Mary's Pharmacy provides retail pharmaceutical dispensary services. If you or a loved one is facing an acute medical emergency, chest pain, difficulty breathing, or poisoning, please call emergency services (112 / 102) or go to the nearest emergency hospital immediately.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-600" /> Physical Pharmacy Dispensary
            </h3>
            <div className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <p className="font-semibold text-slate-800">St Mary's Licensed Community Pharmacy</p>
              <p>#42 Healthcare Boulevard, 100ft Ring Road, Indiranagar</p>
              <p>Bengaluru, Karnataka 560038, India</p>
              <p className="text-slate-400 text-[11px] pt-1">
                State Drug License: <span className="font-mono text-slate-700">KA-BNG-2024-88491</span>
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" /> Operating Dispensary Hours
            </h3>
            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Monday – Saturday</span>
                <strong className="text-slate-900">8:00 AM – 10:00 PM</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Sunday</span>
                <strong className="text-slate-900">9:00 AM – 6:00 PM</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Website & AI Support</span>
                <span className="text-teal-700 font-bold">24 / 7 Available</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-teal-600" /> Direct Contact
            </h3>
            <div className="text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
                <span>Phone: <strong className="text-slate-900">+91 98765 43210</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-600" />
                <span>Email: <strong className="text-slate-900">support@stmaryspharmacy.com</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Fast Connect Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-3xl p-8 shadow-lg flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Direct WhatsApp Assistance
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Connect directly with our dispensary pharmacist on WhatsApp for medicine inquiries, prescription checks, bulk requests, and order updates.
            </p>
          </div>

          <div className="space-y-3">
            <a
              href={createWhatsAppUrl('Hello Pharmacist, I need help regarding a medicine or my order.')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span>Start WhatsApp Chat Now</span>
            </a>
            <p className="text-[11px] text-emerald-200 text-center">
              Replies typically in less than 15 minutes during working hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
