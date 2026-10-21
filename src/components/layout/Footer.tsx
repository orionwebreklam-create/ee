import Link from "next/link";
import { PhoneCall, Mail, MapPin, ShieldCheck, Flame, CreditCard, Clock, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-amber-500/20 mt-auto pt-16 pb-8">
      <div className="container mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div>
            <Link href="/" className="flex items-center space-x-3 mb-4 group">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-neutral-900 border border-amber-500/30 p-1 shadow-lg shadow-amber-500/10 group-hover:border-amber-400 group-hover:shadow-amber-500/30 transition-all duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/uploads/1790692225772_Since_1978.png"
                  alt="Ardabey Sucukları"
                  className="h-full w-full object-contain filter drop-shadow group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-xl font-black tracking-wider text-white">
                  <span>ARDABEY</span>
                  <span className="text-amber-400">SUCUKLARI</span>
                </div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
                  Geleneksel Afyon Lezzeti • 1978
                </span>
              </div>
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              1978&apos;den bu yana Afyonkarahisar&apos;ın tescilli lezzetini sofralara taşıyoruz. %100 yerli besi dana eti, asırlık baharat reçeteleri ve doğal kurutma fırınlarında geleneksel ustalık.
            </p>
            <div className="flex items-center space-x-2 text-xs text-amber-400 font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>Tescilli Coğrafi İşaret • Helal Kesim</span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Hızlı Menü
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/products" className="hover:text-amber-400 transition">Ürünlerimiz & Fiyatlar</Link>
              </li>
              <li>
                <Link href="/campaigns" className="hover:text-amber-400 transition">Kampanyalı Paketler</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition">Hakkımızda & Üretimimiz</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition">İletişim & Fabrika Satış</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-neutral-200 transition">Yönetim Paneli Girişi</Link>
              </li>
            </ul>
          </div>
          
          {/* Customer & Security */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-red-600 pl-2">
              Müşteri Hizmetleri
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/cart" className="hover:text-amber-400 transition">Sepetim & Sipariş Tamamla</Link>
              </li>
              <li>
                <span className="text-neutral-500">Sipariş & Kargo Takibi (24 Saatte Teslimat)</span>
              </li>
              <li>
                <span className="text-neutral-500">Soğuk Zincir Strafor Kutulama Garantisi</span>
              </li>
              <li>
                <span className="text-neutral-500">Mesafeli Satış & İade Koşulları</span>
              </li>
              <li>
                <span className="text-neutral-500">KVKK & Gizlilik Politikası</span>
              </li>
            </ul>
          </div>
          
          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Müşteri Destek Merkezi
            </h3>
            <div className="space-y-3 text-xs">
              <a 
                href="tel:08503081923" 
                className="flex items-center space-x-2.5 text-amber-400 font-bold hover:text-amber-300 transition"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 border border-amber-500/30">
                  <PhoneCall className="h-3.5 w-3.5" />
                </div>
                <span>0850 308 19 23 (7/24 Destek)</span>
              </a>

              <a 
                href="https://wa.me/905321234567" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 text-emerald-400 font-bold hover:text-emerald-300 transition"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 border border-emerald-500/30">
                  <MessageCircle className="h-3.5 w-3.5" />
                </div>
                <span>WhatsApp Sipariş Hattı</span>
              </a>

              <div className="flex items-center space-x-2.5 text-neutral-400">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 border border-neutral-800">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <span>siparis@ardabeysucuklari.com</span>
              </div>

              <div className="flex items-start space-x-2.5 text-neutral-400">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 border border-neutral-800 shrink-0">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <span>Organize Sanayi Bölgesi, Sucukçular Cad. No:14 Afyonkarahisar</span>
              </div>
            </div>
          </div>

        </div>
        
        {/* Bottom Bar: Security & Copyright */}
        <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} Ardabey Sucukları San. ve Tic. A.Ş. Tüm Hakları Saklıdır.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 text-neutral-400">
              <CreditCard className="h-4 w-4 text-amber-500" /> 256-Bit SSL Güvenli Altyapı
            </span>
            <span>•</span>
            <span className="text-neutral-400">Kapıda Nakit & Kredi Kartı İmkanı</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
