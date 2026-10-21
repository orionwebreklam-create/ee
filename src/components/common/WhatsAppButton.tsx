"use client";

import { MessageCircle, PhoneCall, X } from "lucide-react";
import { useState } from "react";

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = "905321234567";
  const defaultMessage = encodeURIComponent("Merhaba Ardabey Sucukları, sucuk siparişi vermek ve bilgi almak istiyorum.");

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* Quick Popup Bubble when expanded */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-xs sm:w-80 rounded-2xl bg-neutral-900 border border-neutral-700/80 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-3">
            <div className="flex items-center space-x-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                <MessageCircle className="h-6 w-6" />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-300 ring-2 ring-neutral-900" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide">WhatsApp Sipariş Hattı</h4>
                <p className="text-xs text-emerald-400 font-medium">Şu an çevrimiçi • Anında Yanıt</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white transition-colors p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-neutral-300 mb-4 leading-relaxed bg-neutral-800/60 p-2.5 rounded-lg border border-neutral-700/40">
            🥩 Afyonkarahisar&apos;ın tescilli Ardabey Sucukları için özel kg siparişi ve toptan alım taleplerinizi hemen iletebilirsiniz.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-lg shadow-emerald-900/40 hover:scale-[1.02]"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Sohbete Başla</span>
          </a>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="flex items-center space-x-3">
        {/* Floating Tag */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden sm:flex items-center space-x-2 bg-neutral-950/90 hover:bg-neutral-900 text-white text-xs font-semibold py-2 px-3.5 rounded-full border border-emerald-500/40 shadow-xl backdrop-blur-md transition-all group hover:border-emerald-400"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-neutral-200 group-hover:text-emerald-300">WhatsApp Sipariş Hattı</span>
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp Sipariş Hattı"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 animate-pulse-glow"
        >
          <MessageCircle className="h-7 w-7" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-neutral-950">
            1
          </span>
        </a>
      </div>
    </div>
  );
}
