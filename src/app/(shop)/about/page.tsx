import Link from "next/link";
import { Sparkles, ShieldCheck, Flame, Award, Truck, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-neutral-950 min-h-screen py-16 text-neutral-100">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-900 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>1984&apos;ten Bugüne</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            ARDABEY <span className="gold-gradient-text">HİKAYESİ & KALİTE</span>
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base mt-3">
            Afyonkarahisar&apos;ın asırlık sucukçuluk geleneğini ödün vermeden yaşatan aile lezzeti.
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-12">
          
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
            <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-2.5">
              <Flame className="h-6 w-6 text-red-600" />
              <span>Geleneksel Ustalık ve Saf Et Prensibi</span>
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed mb-4">
              Ardabey Sucukları, Afyonkarahisar&apos;ın tescilli coğrafi işaretine sadık kalarak sadece %100 yerli besi danaların but ve kaburga etleriyle üretilir. Ürünlerimizde mekanik ayrılmış et (MDM), soya, nişasta veya renklendirici kimyasallara kesinlikle yer verilmez.
            </p>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Doğal Taşköprü sarımsağı, özel tatlı ve acı kırmızı biber harmanı ve geleneksel baharat reçetesi etle yoğrulduktan sonra doğal dana bağırsağına doldurulur. 21 günlük doğal fermantasyon ve kuruma sürecinden sonra sofralarınıza sunulur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-2xl">
              <Award className="h-7 w-7 text-amber-400 mb-3" />
              <h3 className="font-bold text-white mb-1 text-base">%100 Helal & Doğal</h3>
              <p className="text-xs text-neutral-400">Veteriner hekim kontrolünde İslami usullere uygun kesilmiş yerli besi danalar.</p>
            </div>

            <div className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-2xl">
              <Truck className="h-7 w-7 text-red-500 mb-3" />
              <h3 className="font-bold text-white mb-1 text-base">Soğuk Zincir Kargo</h3>
              <p className="text-xs text-neutral-400">Özel strafor kutular ve buz aküleri sayesinde ürün tazeliğini kaybetmeden kapınızda.</p>
            </div>

            <div className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-2xl">
              <ShieldCheck className="h-7 w-7 text-emerald-400 mb-3" />
              <h3 className="font-bold text-white mb-1 text-base">Koşulsuz Memnuniyet</h3>
              <p className="text-xs text-neutral-400">Damak tadınıza uymazsa sorgusuz sualsiz ürün değişimi ve iade garantisi.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
