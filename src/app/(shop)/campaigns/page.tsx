import Link from "next/link";
import { Sparkles, Tag, ShoppingBag, ArrowRight } from "lucide-react";

export default function CampaignsPage() {
  const campaigns = [
    {
      id: 1,
      title: "5 KG ve Üzeri Alımlarda Özel İndirim",
      desc: "Herhangi bir sucuk çeşidinde 5 kg veya üzeri sepet yaptığınızda kg başı otomatik 50 ₺ ek indirim tanımlanır!",
      badge: "Süper Fırsat",
      code: "OTOMATİK50",
      validUntil: "Bu Ay Sonuna Kadar"
    },
    {
      id: 2,
      title: "3 KG ve Üzeri Siparişlerde Ücretsiz Kargo",
      desc: "Afyon'dan kapınıza kadar olan özel ısı yalıtımlı soğuk zincir kargo bedeli firmamız tarafından karşılanmaktadır.",
      badge: "Ücretsiz Kargo",
      code: "KARGO0",
      validUntil: "Tüm Yıl Boyunca"
    },
    {
      id: 3,
      title: "Toplu Alım / Restoran & Kasap Paketi (20 KG)",
      desc: "İşletmeler ve kalabalık aileler için özel toptan fiyatlandırma ve WhatsApp destek hattından anında faturalı teklif.",
      badge: "Toptan Özel",
      code: "B2B-TEKLIF",
      validUntil: "Aktif"
    }
  ];

  return (
    <div className="bg-neutral-950 min-h-screen py-16 text-neutral-100">
      <div className="container mx-auto px-4 max-w-5xl">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-900 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Avantajlı Teklifler</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            GÜNCEL <span className="gold-gradient-text">KAMPANYALAR</span>
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base mt-3">
            Afyon sucuğu lezzetini en avantajlı fiyatlarla sofralarınıza taşıyın.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {campaigns.map((camp) => (
            <div 
              key={camp.id}
              className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
            >
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-red-600 text-white mb-4">
                  {camp.badge}
                </span>
                <h3 className="text-lg font-bold text-white mb-3">{camp.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-6">{camp.desc}</p>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 block">Kampanya Kodu:</span>
                  <span className="text-xs font-mono font-bold text-amber-400">{camp.code}</span>
                </div>
                <Link
                  href="/products"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white transition-all"
                >
                  <span>Kullan</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
