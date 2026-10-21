"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { 
  Star, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  MessageCircle, 
  Check, 
  Minus, 
  Plus, 
  Award,
  Flame,
  PhoneCall
} from "lucide-react";

const productCatalog: Record<string, {
  name: string;
  tag: string;
  description: string;
  pricePerKg: number;
  image: string;
  features: string[];
  specs: { label: string; value: string }[];
}> = {
  "1": {
    name: "Özel Afyon Kangal Sucuk",
    tag: "En Çok Tercih Edilen",
    description: "Geleneksel Türk damak tadının zirvesi! %100 yerli besi dana eti, taze Taşköprü sarımsağı ve yöresel Afyon baharatlarıyla hazırlanmış hakiki kangal sucuk. Doğal bağırsakta ve geleneksel fırınlarda 21 gün dinlendirilerek olgunlaştırılmıştır.",
    pricePerKg: 590,
    image: "/uploads/1790690304656_sucuk_duzenleme_07_UHD.jpg",
    features: [
      "%100 Yerli Besi Dana Eti",
      "Doğal Dana Bağırsak",
      "Isıl İşlemsiz Doğal Fermente",
      "Sıfır Kimyasal Katkı & Koruyucu",
      "Glutensiz & Helal Kesim Sertifikalı",
      "Taş Fırınlarda Dinlendirilmiş"
    ],
    specs: [
      { label: "Menşei", value: "Afyonkarahisar / Türkiye" },
      { label: "Üretim Şekli", value: "Geleneksel Doğal Fermantasyon" },
      { label: "Et Türü", value: "%100 Dana Eti (But ve Kaburga)" },
      { label: "Muhafaza", value: "0°C ile +4°C arasında muhafaza ediniz" }
    ]
  },
  "2": {
    name: "Gurme Acılı Parmak Sucuk",
    tag: "Acı Severlere Özel",
    description: "Özel harmanlanmış Maraş ve Urfa ipek pul biberleriyle yoğrulmuş, acısıyla iştah kabartan parmak formunda Afyon sucuğu. Sahanda yumurtada veya mangalda dışı çıtır içi sulu kalır.",
    pricePerKg: 620,
    image: "/uploads/1790690316545_sucuk_duzenleme_19_UHD.jpg",
    features: [
      "%100 Dana Eti",
      "Doğal Acı Pul Biber Karışımı",
      "Mangala Uygun İdeal Yağ Oranı",
      "Geleneksel Kurutma",
      "Katkısız & Doğal Bağırsak"
    ],
    specs: [
      { label: "Menşei", value: "Afyonkarahisar" },
      { label: "Acılık Oranı", value: "Orta - Yüksek Gurme Acı" },
      { label: "Muhafaza", value: "+4°C Vakumlu Ambalaj" }
    ]
  },
  "3": {
    name: "Geleneksel Ev Tipi Doğal Fermente",
    tag: "Sınırlı Üretim",
    description: "Isıl işlem görmemiş, 21 gün doğal fermantasyon odalarında olgunlaştırılmış %100 katkısız doğal et lezzeti.",
    pricePerKg: 680,
    image: "/uploads/1790690334386_sucuk_duzenleme_14_UHD.jpg",
    features: [
      "21 Gün Doğal Kurutma",
      "Geleneksel Ev Tipi Reçete",
      "Katkısız & Koruyucusuz"
    ],
    specs: [
      { label: "Menşei", value: "Afyonkarahisar" },
      { label: "Olgunlaşma", value: "21 Gün Doğal Fırınlama" }
    ]
  },
  "4": {
    name: "Özel Dilimli Pratik Kangal Sucuk",
    tag: "Hızlı & Pratik",
    description: "Kahvaltılar ve tostlar için ideal kalınlıkta hijyenik dilimlenmiş, tazeliği kilitli özel vakum pakette.",
    pricePerKg: 640,
    image: "/uploads/1790690350599_sucuk_duzenleme_16_UHD.jpg",
    features: [
      "Eşit Dilimlenmiş Dilimler",
      "Tazeliği Korumalı Vakum Ambalaj"
    ],
    specs: [
      { label: "Menşei", value: "Afyonkarahisar" },
      { label: "Paket", value: "Vakumlu Koruyucu Tabak" }
    ]
  }
};

const defaultProduct = productCatalog["1"];

const weightOptions = [1, 3, 5, 10, 20];

export default function ProductDetail() {
  const { addToCart } = useCart();
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "1";
  
  const [item, setItem] = useState<{
    id?: number;
    name: string;
    tag: string;
    description: string;
    pricePerKg: number;
    image: string;
    features: string[];
    specs: { label: string; value: string }[];
  }>(productCatalog[id] || defaultProduct);

  const [selectedWeight, setSelectedWeight] = useState(3);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.product) {
          const p = data.product;
          setItem(prev => ({
            ...prev,
            id: p.id,
            name: p.name || prev.name,
            tag: p.tag || prev.tag,
            description: p.description || prev.description,
            pricePerKg: p.pricePerKg || prev.pricePerKg,
            image: p.imageUrl || prev.image,
            features: p.features || prev.features,
            specs: p.specs || prev.specs
          }));
        }
      })
      .catch(console.error);
  }, [id]);

  // Bulk discount: 5kg and above gives 50 TL discount per kg
  const discountPerKg = selectedWeight >= 5 ? 50 : 0;
  const effectivePricePerKg = item.pricePerKg - discountPerKg;
  const singlePackTotal = effectivePricePerKg * selectedWeight;
  const grandTotal = singlePackTotal * quantity;

  const whatsappMessage = encodeURIComponent(
    `Merhaba, Ardabey Sucukları web sitesinden "${item.name}" ürününü ${quantity} adet (${selectedWeight} KG x ${quantity} = ${selectedWeight * quantity} KG) sipariş vermek istiyorum.`
  );

  return (
    <div className="bg-neutral-950 min-h-screen py-10 text-neutral-100">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link 
            href="/products" 
            className="inline-flex items-center space-x-2 text-xs font-semibold text-neutral-400 hover:text-amber-400 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Tüm Sucuk Çeşitlerine Dön</span>
          </Link>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          
          {/* Left: Product Image */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-lg">
                  {item.tag}
                </span>
              </div>
            </div>

            {/* Trust highlights under image */}
            <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center space-x-2 bg-neutral-950/60 p-3 rounded-xl border border-neutral-800">
                <Truck className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="text-neutral-300">Buz Akülü Soğuk Zincir</span>
              </div>
              <div className="flex items-center space-x-2 bg-neutral-950/60 p-3 rounded-xl border border-neutral-800">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-neutral-300">%100 Helal & Katkısız</span>
              </div>
            </div>
          </div>

          {/* Right: Product Info & Order Config */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Rating & reviews */}
              <div className="flex items-center space-x-2 mb-3 text-amber-400">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-white">4.9 / 5.0</span>
                <span className="text-xs text-neutral-500">• 320+ Başarılı Müşteri Teslimatı</span>
              </div>

              {/* Title & Unit Price */}
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
                {item.name}
              </h1>

              <div className="flex items-baseline space-x-3 mb-6 pb-6 border-b border-neutral-800">
                <span className="text-3xl font-black text-amber-400">{effectivePricePerKg} ₺</span>
                <span className="text-sm text-neutral-400">/ Kilogram</span>
                {discountPerKg > 0 && (
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    50 ₺/Kg Toplu İndirim Uygulandı!
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                {item.description}
              </p>

              {/* Features List */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-3">
                  Öne Çıkan Özellikler:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {item.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-neutral-300">
                      <Check className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* KG Selection */}
              <div className="mb-6 bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Paket Ağırlığı Seçiniz:
                  </span>
                  <span className="text-xs text-neutral-400 font-medium">Seçili: {selectedWeight} KG</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {weightOptions.map((weight) => (
                    <button
                      key={weight}
                      onClick={() => setSelectedWeight(weight)}
                      className={`py-3 text-xs font-bold rounded-xl border transition-all ${
                        selectedWeight === weight
                          ? "bg-amber-500 text-neutral-950 border-amber-400 font-black shadow-lg shadow-amber-500/20 scale-105"
                          : "bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800"
                      }`}
                    >
                      {weight} KG
                    </button>
                  ))}
                </div>
                {selectedWeight < 5 && (
                  <p className="text-[11px] text-amber-400/80 mt-2 font-medium">
                    💡 İpucu: 5 KG ve üzeri seçimlerde kg başı 50 ₺ ek indirim kazanabilirsiniz.
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Paket Adedi:</span>
                <div className="flex items-center rounded-xl bg-neutral-950 border border-neutral-800 p-1">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom: Total & Actions */}
            <div className="pt-6 border-t border-neutral-800">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span className="text-xs text-neutral-400 block">Toplam Tutar:</span>
                  <span className="text-xs text-neutral-500">({quantity} Adet x {selectedWeight} KG = {quantity * selectedWeight} KG)</span>
                </div>
                <span className="text-3xl sm:text-4xl font-black text-white">
                  {grandTotal.toLocaleString("tr-TR")} ₺
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={(e) => addToCart({
                    id: Number(id) || 1,
                    name: item.name,
                    pricePerKg: item.pricePerKg,
                    image: item.image
                  }, selectedWeight, quantity, e)}
                  className="flex items-center justify-center space-x-2 py-4 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-xl shadow-red-900/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Sepete Ekle</span>
                </button>

                <a
                  href={`https://wa.me/905321234567?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp ile Sipariş Ver</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
