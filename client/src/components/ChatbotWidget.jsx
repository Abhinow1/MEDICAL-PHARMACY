import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  MessageCircle, 
  AlertCircle, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';
import api from '../services/api';
import { createWhatsAppUrl } from '../utils/formatters';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your St Mary\'s Pharmacy Assistant. How can I help you today? Ask about medicines, delivery, store timings, or order status.',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageToSend = null) => {
    const text = (messageToSend || inputMessage).trim();
    if (!text || loading) return;

    // Append user message
    const userMsg = { sender: 'user', text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await api.post('/chat', { message: text });
      if (res.data.success) {
        const botData = res.data.data;
        const botMsg = {
          sender: 'bot',
          text: botData.reply,
          action: botData.action,
          whatsappUrl: botData.whatsappUrl,
          products: botData.products,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: 'I am sorry, I could not process your query right now. Please try again or chat with us on WhatsApp.',
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Unable to reach the server. Please check your network connection.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    handleSend(prompt);
  };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-5 md:right-5 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white rounded-full p-3 sm:p-3.5 shadow-xl flex items-center gap-2 transition hover:scale-105 active:scale-95 group"
          aria-label="Open Pharmacy AI Assistant"
        >
          <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="hidden sm:inline-block text-xs font-semibold pr-1">
            Pharmacy Assistant
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 ring-2 ring-teal-600 animate-pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white border border-slate-200 rounded-3xl sm:rounded-2xl shadow-2xl w-[calc(100vw-2rem)] sm:w-[380px] h-[75dvh] sm:h-[520px] max-h-[600px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6">
          {/* Header */}
          <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold flex items-center gap-1.5">
                  St Mary's Assistant
                  <span className="text-[10px] bg-teal-900/80 text-teal-300 px-1.5 py-0.2 rounded font-normal">
                    AI Helper
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400">Products & Store Support</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Medical Safety Disclaimer Strip */}
          <div className="bg-amber-50 border-b border-amber-200/60 px-3 py-1.5 text-[10px] text-amber-800 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span>Cannot diagnose illnesses or replace medical consultations.</span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-tr-none shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Product items if matched */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5">
                      {msg.products.map((p) => (
                        <a
                          key={p._id}
                          href={`/medicines/${p._id}`}
                          className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-200 text-slate-900 transition"
                        >
                          <span className="font-semibold truncate max-w-[170px] text-[11px]">
                            {p.name}
                          </span>
                          <span className="font-bold text-teal-700 text-[11px]">
                            ₹{p.price}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* WhatsApp escalation link */}
                  {msg.whatsappUrl && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <a
                        href={msg.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md hover:bg-emerald-100 transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> Chat on WhatsApp
                      </a>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-slate-400 text-xs">
                <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-3 py-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] whitespace-nowrap no-scrollbar">
            <button
              onClick={() => handleQuickPrompt('What are your store hours?')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition"
            >
              🕒 Store Hours
            </button>
            <button
              onClick={() => handleQuickPrompt('Do you have Paracetamol?')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition"
            >
              💊 Find Paracetamol
            </button>
            <button
              onClick={() => handleQuickPrompt('Where is my order?')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition"
            >
              📦 Track Order
            </button>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about products, delivery, orders..."
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl p-2 transition flex-shrink-0"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
