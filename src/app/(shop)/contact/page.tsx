"use client";

import { PhoneCall, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-neutral-950 min-h-screen py-16 text-neutral-100">
      <div className="container mx-auto px-4 max-w-5xl">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            BİZE <span className="gold-gradient-text">ULAŞIN</span>
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base mt-3">
            Siparişleriniz, toptan talepleriniz veya sorularınız için 7/24 hizmetinizdeyiz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Contact Details */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-8 shadow-2xl space-y-6">
            <h2 className="text-xl font-bold text-white mb-6">Müşteri Destek & İletişim Bilgileri</h2>

            <div className="flex items-start space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <PhoneCall className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-neutral-400 uppercase font-semibold block">Müşteri Destek Merkezi</span>
                <a href="tel:08503081923" className="text-base font-bold text-white hover:text-amber-400 transition">
                  0850 308 19 23
                </a>
                <p className="text-xs text-neutral-500 mt-0.5">Haftanın 7 günü 08:30 - 22:00 arası canlı destek</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-neutral-400 uppercase font-semibold block">WhatsApp Sipariş Hattı</span>
                <a 
                  href="https://wa.me/905321234567" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-base font-bold text-emerald-400 hover:underline"
                >
                  +90 532 123 45 67
                </a>
                <p className="text-xs text-neutral-500 mt-0.5">Anında mesaj ile sipariş ve bilgi</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800 text-neutral-300 shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-neutral-400 uppercase font-semibold block">Kurumsal E-Posta</span>
                <span className="text-sm font-semibold text-white">bilgi@ardabeysucuklari.com</span>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800 text-neutral-300 shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-neutral-400 uppercase font-semibold block">Fabrika & Üretim Tesisi</span>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Organize Sanayi Bölgesi, Sucukçular Cad. No: 14 <br />
                  Merkez / Afyonkarahisar
                </p>
              </div>
            </div>

          </div>

          {/* Quick Message Form */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Bize Mesaj Gönderin</h2>
            <form className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Adınız Soyadınız</label>
                <input 
                  type="text" 
                  placeholder="Ahmet Yılmaz" 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" 
                />
              </div>
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Telefon veya E-Posta</label>
                <input 
                  type="text" 
                  placeholder="05XX XXX XX XX veya ornek@mail.com" 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" 
                />
              </div>
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Konu</label>
                <input 
                  type="text" 
                  placeholder="Sipariş / Toptan Alım / Destek" 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" 
                />
              </div>
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Mesajınız</label>
                <textarea 
                  rows={4} 
                  placeholder="İletmek istediğiniz mesaj..." 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <button
                type="button"
                onClick={() => alert("Mesajınız başarıyla iletildi. Müşteri temsilcimiz en kısa sürede dönüş yapacaktır.")}
                className="w-full flex items-center justify-center space-x-2 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-red-900/40"
              >
                <Send className="h-4 w-4" />
                <span>Mesajı Gönder</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
