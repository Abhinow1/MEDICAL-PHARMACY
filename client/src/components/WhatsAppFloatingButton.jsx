import React from 'react';
import { MessageCircle } from 'lucide-react';
import { createWhatsAppUrl } from '../utils/formatters';

const WhatsAppFloatingButton = ({ customMessage = 'Hello MediCare Pharmacy, I need help with a medicine.' }) => {
  return (
    <a
      href={createWhatsAppUrl(customMessage)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-36 right-4 md:bottom-20 md:right-5 z-40 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-2.5 sm:p-3 shadow-lg flex items-center gap-2 transition hover:scale-105 active:scale-95"
      title="Chat with pharmacist on WhatsApp"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-emerald-500" />
      <span className="hidden sm:inline-block text-xs font-semibold pr-1">
        WhatsApp Us
      </span>
    </a>
  );
};

export default WhatsAppFloatingButton;
