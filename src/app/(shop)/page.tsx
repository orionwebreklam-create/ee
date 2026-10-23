"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import HeroSlider from "@/components/home/HeroSlider";
import { 
  ShieldCheck, 
  Truck, 
  Award, 
  RotateCcw, 
  Star, 
  Flame, 
  ShoppingBag, 
  CheckCircle2, 
  MessageCircle, 
  ArrowRight, 
  PackageCheck,
  Clock,
  Sparkles
} from "lucide-react";

interface Pkg {
  kg: number;
  price: number;
  gift?: number;
}

interface ProductItem {
  id: number;
  name: string;
  tag: string;
  tagColor?: string;
  description: string;
  basePricePerKg: number;
  pricePerKg?: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  packages?: Pkg[];
  variants?: string[];
}

const defaultProducts: ProductItem[] = [
  {
    id: 1,
    name: "Afyon Sucuğu",
    tag: "En Çok Satan",
    tagColor: "bg-red-600 text-white",
    description: "Doğal bağırsakta 21 gün fermente edilmiş, sarımsak ve Afyon baharatlarıyla yoğrulmuş hakiki lezzet.",
    basePricePerKg: 350,
    rating: 4.9,
    reviewsCount: 328,
    imageUrl: "/uploads/1790690304656_sucuk_duzenleme_07_UHD.jpg",
    packages: [
      { kg: 1, price: 350 },
      { kg: 5, price: 1750, gift: 1 },
      { kg: 7, price: 2000, gift: 1.5 },
      { kg: 10, price: 3500, gift: 2 }
    ],
    variants: ["Acısız", "Acılı"]
  },
  {
    id: 2,
    name: "Baton Sucuk",
    tag: "Pratik",
    tagColor: "bg-amber-500 text-neutral-950 font-bold",
    description: "Pratik tüketim için ideal baton formunda, geleneksel reçeteyle üretilmiş doğal fermente sucuk.",
    basePricePerKg: 400,
    rating: 4.8,
    reviewsCount: 184,
    imageUrl: "/uploads/1790690316545_sucuk_duzenleme_19_UHD.jpg",
    packages: [
      { kg: 1, price: 400 },
      { kg: 5, price: 1800, gift: 1 },
      { kg: 7, price: 2100, gift: 1.5 },
      { kg: 10, price: 3500, gift: 2 }
    ]
  },
  {
    id: 3,
    name: "Bez Sucuk",
    tag: "Geleneksel",
    tagColor: "bg-emerald-600 text-white",
    description: "Geleneksel bez yöntemiyle sarılarak dinlendirilmiş, yoğun aromalı özel Afyon sucuğu.",
    basePricePerKg: 550,
    rating: 4.9,
    reviewsCount: 146,
    imageUrl: "/uploads/1790690334386_sucuk_duzenleme_14_UHD.jpg",
    packages: [
      { kg: 1, price: 550 },
      { kg: 5, price: 2750 },
      { kg: 7, price: 3850 },
      { kg: 10, price: 5500 }
    ]
  }
];

export default function Home() {
  const { addToCart } = useCart();
  const [productList, setProductList] = useState<ProductItem[]>(defaultProducts);
  const [selectedKgMap, setSelectedKgMap] = useState<Record<number, number>>({});
  const [selectedVariantMap, setSelectedVariantMap] = useState<Record<number, string>>({});

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        if (data.products && data.products.length > 0) {
          const mapped = data.products.map((p: any) => ({
            id: p.id,
            name: p.name,
            tag: p.tag || "Doğal Lezzet",
            tagColor: p.tagColor || "bg-red-600 text-white",
            description: p.description,
            basePricePerKg: p.pricePerKg,
            rating: p.rating || 5.0,
            reviewsCount: p.reviewsCount || 150,
            imageUrl: p.imageUrl || "/uploads/1790690304656_sucuk_duzenleme_07_UHD.jpg",
            packages: p.packages || [],
            variants: p.variants || []
          }));
          setProductList(mapped);
        }
      })
      .catch(console.error);
  }, []);

  const handleKgChange = (productId: number, kg: number) => {
    setSelectedKgMap(prev => ({ ...prev, [productId]: kg }));
  };

  const handleVariantChange = (productId: number, v: string) => {
    setSelectedVariantMap(prev => ({ ...prev, [productId]: v }));
  };

  return (
    <div className="flex flex-col bg-neutral-950 text-neutral-100">
      
      {/* 1. Modern Auto Hero Slider */}
      <HeroSlider />

      {/* 2. Trust & Value Propositions Bar */}
      <section className="relative z-20 -mt-10 sm:-mt-14 container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          
          <div className="dark-glass rounded-2xl p-4 sm:p-5 flex items-center space-x-3.5 border border-amber-500/20 shadow-xl hover:border-amber-400/50 transition-all hover:scale-[1.02]">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
              <Truck className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">Soğuk Zincir Kargo</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Buz akülü özel kutuda 24s teslim</p>
            </div>
          </div>

          <div className="dark-glass rounded-2xl p-4 sm:p-5 flex items-center space-x-3.5 border border-amber-500/20 shadow-xl hover:border-amber-400/50 transition-all hover:scale-[1.02]">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">%100 Afyon Sucuğu</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Helal kesim & sıfır katkı maddesi</p>
            </div>
          </div>

          <div className="dark-glass rounded-2xl p-4 sm:p-5 flex items-center space-x-3.5 border border-amber-500/20 shadow-xl hover:border-amber-400/50 transition-all hover:scale-[1.02]">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Award className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">Tescilli Afyon Lezzeti</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Geleneksel reçete & odun ateşi</p>
            </div>
          </div>

          <div className="dark-glass rounded-2xl p-4 sm:p-5 flex items-center space-x-3.5 border border-amber-500/20 shadow-xl hover:border-amber-400/50 transition-all hover:scale-[1.02]">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">%100 Lezzet Garantisi</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Beğenmezseniz sorgusuz iade</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Featured Products & Weight Selection Showcase */}
      <section className="py-20 sm:py-24 container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-900 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Gurme Koleksiyonu</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            ARDABEY <span className="gold-gradient-text">ÖZEL SEÇİM</span> SUCUKLARI
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base mt-3">
            Sipariş vermek istediğiniz paketi (1, 5, 7, 10 KG) seçin, avantajlı paket fiyatıyla sepetinize ekleyin.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {productList.map((product) => {
            const packages = product.packages && product.packages.length > 0
              ? product.packages
              : [{ kg: 1, price: product.basePricePerKg }];
            const currentKg = selectedKgMap[product.id] || packages[0].kg;
            const pkg = packages.find(x => x.kg === currentKg) || packages[0];
            const variants = product.variants || [];
            const variant = selectedVariantMap[product.id] || variants[0];
            const totalPrice = pkg.price;

            return (
              <div 
                key={product.id}
                className="group relative rounded-3xl bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/40 p-5 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:scale-[1.01] hover:shadow-amber-500/5"
              >
                {/* Image & Badge Container */}
                <div>
                  <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-neutral-950 mb-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-black/20" />
                    
                    {/* Tag badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-md ${product.tagColor}`}>
                        {product.tag}
                      </span>
                    </div>

                    {/* Weight selector overlay chip */}
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center bg-neutral-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-neutral-800 text-xs">
                      <span className="text-neutral-300 font-medium">Birim Fiyat:</span>
                      <span className="font-bold text-amber-400">{product.basePricePerKg} ₺ / KG</span>
                    </div>
                  </div>

                  {/* Product Title & Reviews */}
                  <div className="flex items-center space-x-1.5 mb-2 text-amber-400">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-neutral-200">{product.rating}</span>
                    <span className="text-xs text-neutral-500">({product.reviewsCount})</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors mb-2">
                    <Link href={`/products/${product.id}`}>{product.name}</Link>
                  </h3>
                  
                  <p className="text-neutral-400 text-xs leading-relaxed mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Variant Selector (acılı/acısız) */}
                  {variants.length > 1 && (
                    <div className="mb-3">
                      <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider block mb-1.5">
                        Seçenek:
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {variants.map((v) => (
                          <button
                            key={v}
                            onClick={() => handleVariantChange(product.id, v)}
                            className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                              variant === v
                                ? "bg-red-600 text-white border-red-500 shadow-md shadow-red-900/30"
                                : "bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border-neutral-700"
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Package Selector (1, 5, 7, 10 KG) */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                        Paket Seçimi:
                      </label>
                      {pkg.gift ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          +{pkg.gift} KG Hediye
                        </span>
                      ) : null}
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {packages.map((opt) => (
                        <button
                          key={opt.kg}
                          onClick={() => handleKgChange(product.id, opt.kg)}
                          className={`relative py-1.5 text-xs font-bold rounded-lg border transition-all ${
                            currentKg === opt.kg
                              ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/20 scale-105"
                              : "bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border-neutral-700"
                          }`}
                        >
                          {opt.kg}kg
                          {opt.gift ? (
                            <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-neutral-950 text-[8px] font-black">
                              {opt.gift}
                            </span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price & Add to Cart Action */}
                <div className="pt-3 border-t border-neutral-800">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-xs text-neutral-400 font-medium">{currentKg} KG Tutarı:</span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-white">{totalPrice.toLocaleString("tr-TR")} ₺</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="py-2.5 px-3 text-center text-xs font-semibold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors"
                    >
                      Detaylar
                    </Link>
                    <button
                      onClick={(e) => addToCart({
                        id: product.id,
                        name: product.name,
                        image: product.imageUrl
                      }, pkg, 1, variants.length > 1 ? variant : undefined, e)}
                      className="flex items-center justify-center space-x-1.5 py-2.5 px-3 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>Sepete Ekle</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* View All Products Button */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-full border border-amber-500/40 bg-neutral-900 hover:bg-neutral-800 text-amber-400 hover:text-white font-bold text-sm tracking-wide transition-all duration-300 hover:border-amber-400 hover:scale-105 shadow-xl"
          >
            <span>Tüm Sucuk Çeşitlerini ve Fiyatları Görüntüle</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </section>

      {/* 4. Production Process / Ustalık Hikayesi */}
      <section className="py-20 bg-neutral-900/60 border-y border-neutral-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-semibold mb-4">
                <Flame className="h-3.5 w-3.5" />
                <span>Afyonkarahisar&apos;ın Gururu</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-6">
                KİMYASALSIZ, ISIL İŞLEMSİZ, <br />
                <span className="gold-gradient-text">GERÇEK DOĞAL FERMANTASYON</span>
              </h2>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6">
                Market raflarında gördüğünüz hızlı pişirilmiş (ısıl işlem görmüş) sucukların aksine; Ardabey Sucukları sadece özenle seçilmiş but ve kaburga etlerinden çekilir.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Özel Doğal Taş Fırınlar ve İklimlendirme</h4>
                    <p className="text-xs text-neutral-400">Afyon yaylalarının temiz havasında, ideal nem ve sıcaklık dengesinde 21 gün dinlendirilir.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Taş Değirmen Baharatları</h4>
                    <p className="text-xs text-neutral-400">Taşköprü sarımsağı, kimyon, tatlı ve acı kırmızı biber oranları özel asırlık formülle hazırlanır.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Yenilebilir Doğal Bağırsak</h4>
                    <p className="text-xs text-neutral-400">Sentetik kılıf veya koruyucu kimyasallar kesinlikle kullanılmaz, %100 doğaldır.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Link
                  href="/about"
                  className="px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-sm border border-neutral-700 transition-colors"
                >
                  Hikayemizi Okuyun
                </Link>
                <a
                  href="tel:08503081923"
                  className="text-xs sm:text-sm font-semibold text-amber-400 hover:underline flex items-center gap-1.5"
                >
                  <span>Tesislerimizi Ziyaret Edin</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Visual Card / Stats */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden border border-neutral-700 shadow-2xl bg-neutral-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80" 
                  alt="Ardabey Sucuk Üretim ve Kalite"
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                
                {/* Overlay Floating Stats */}
                <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-3">
                  <div className="bg-neutral-900/90 backdrop-blur-md p-3 rounded-2xl border border-neutral-700 text-center">
                    <span className="block text-2xl font-black text-amber-400">40+</span>
                    <span className="text-[10px] text-neutral-300 uppercase font-semibold">Yıllık Tecrübe</span>
                  </div>
                  <div className="bg-neutral-900/90 backdrop-blur-md p-3 rounded-2xl border border-neutral-700 text-center">
                    <span className="block text-2xl font-black text-red-500">%100</span>
                    <span className="text-[10px] text-neutral-300 uppercase font-semibold">Afyon Sucuğu</span>
                  </div>
                  <div className="bg-neutral-900/90 backdrop-blur-md p-3 rounded-2xl border border-neutral-700 text-center">
                    <span className="block text-2xl font-black text-emerald-400">50K+</span>
                    <span className="text-[10px] text-neutral-300 uppercase font-semibold">Mutlu Sofra</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Toptan Satış ve WhatsApp Sipariş Banner */}
      <section className="py-16 container mx-auto px-4">
        <div className="rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-red-950/60 border border-neutral-800 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-4">
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Hızlı Sipariş & B2B Destek</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-4">
              Restoranlar, Kasaplar ve Toplu Tüketim İçin <br />
              <span className="text-emerald-400">Özel Toptan Fiyat Teklifi Alın</span>
            </h2>
            <p className="text-neutral-300 text-sm mb-6 leading-relaxed">
              10 KG, 20 KG ve üzeri siparişlerinizde işletmenize özel indirimler, cari avantajlar ve soğuk zincir teslimat için müşteri temsilcimizle WhatsApp üzerinden anında görüşün.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://wa.me/905321234567?text=Merhaba,%20toptan%20sucuk%20alımı%20için%20fiyat%20teklifi%20almak%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-900/40 hover:scale-105 transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Sipariş Hattı</span>
              </a>
              <a
                href="tel:08503081923"
                className="px-6 py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-sm border border-neutral-700 transition-colors"
              >
                Müşteri Destek: 0850 308 19 23
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
