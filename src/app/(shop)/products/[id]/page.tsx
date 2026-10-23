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
  Gift
} from "lucide-react";

interface Pkg {
  kg: number;
  price: number;
  gift?: number;
}

interface ProductData {
  id?: number;
  name: string;
  tag: string;
  description: string;
  pricePerKg: number;
  image: string;
  features: string[];
  specs: { label: string; value: string }[];
  packages?: Pkg[];
  variants?: string[];
}

const productCatalog: Record<string, ProductData> = {
  "1": {
    name: "Afyon Sucuğu",
    tag: "En Çok Tercih Edilen",
    description: "Geleneksel yöntemlerle üretilmiş, taze Taşköprü sarımsağı ve yöresel Afyon baharatlarıyla yoğrulmuş, doğal bağırsakta 21 gün fermente edilmiş hakiki Afyon sucuğu.",
    pricePerKg: 350,
    image: "/uploads/1790690304656_sucuk_duzenleme_07_UHD.jpg",
    packages: [
      { kg: 1, price: 350 },
      { kg: 5, price: 1750, gift: 1 },
      { kg: 7, price: 2000, gift: 1.5 },
      { kg: 10, price: 3500, gift: 2 }
    ],
    variants: ["Acısız", "Acılı"],
    features: [
      "%100 Afyon Sucuğu",
      "Doğal Bağırsak",
      "Isıl İşlemsiz Doğal Fermente",
      "Sıfır Kimyasal Katkı & Koruyucu",
      "Glutensiz & Helal Kesim Sertifikalı"
    ],
    specs: [
      { label: "Menşei", value: "Afyonkarahisar / Türkiye" },
      { label: "Üretim Şekli", value: "Geleneksel Doğal Fermantasyon" },
      { label: "Seçenek", value: "Acılı / Acısız" }
    ]
  },
  "2": {
    name: "Baton Sucuk",
    tag: "Pratik",
    description: "Pratik tüketim için ideal baton formunda, geleneksel reçeteyle üretilmiş, doğal fermente Afyon sucuğu.",
    pricePerKg: 400,
    image: "/uploads/1790690316545_sucuk_duzenleme_19_UHD.jpg",
    packages: [
      { kg: 1, price: 400 },
      { kg: 5, price: 1800, gift: 1 },
      { kg: 7, price: 2100, gift: 1.5 },
      { kg: 10, price: 3500, gift: 2 }
    ],
    features: [
      "%100 Afyon Sucuğu",
      "Doğal Bağırsak",
      "Geleneksel Kurutma",
      "Katkısız & Koruyucusuz"
    ],
    specs: [
      { label: "Menşei", value: "Afyonkarahisar" },
      { label: "Form", value: "Baton" }
    ]
  },
  "3": {
    name: "Bez Sucuk",
    tag: "Geleneksel",
    description: "Geleneksel bez yöntemiyle sarılarak dinlendirilmiş, yoğun aromalı ve uzun raf ömürlü özel Afyon sucuğu.",
    pricePerKg: 550,
    image: "/uploads/1790690334386_sucuk_duzenleme_14_UHD.jpg",
    packages: [
      { kg: 1, price: 550 },
      { kg: 5, price: 2750 },
      { kg: 7, price: 3850 },
      { kg: 10, price: 5500 }
    ],
    features: [
      "%100 Afyon Sucuğu",
      "Geleneksel Bez Yöntemi",
      "Doğal Bağırsak",
      "Yoğun Aromalı"
    ],
    specs: [
      { label: "Menşei", value: "Afyonkarahisar" },
      { label: "Ambalaj", value: "Geleneksel Bez" }
    ]
  }
};

const defaultProduct = productCatalog["1"];

export default function ProductDetail() {
  const { addToCart } = useCart();
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "1";
  
  const [item, setItem] = useState<ProductData>(productCatalog[id] || defaultProduct);

  const [selectedKg, setSelectedKg] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
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
            specs: p.specs || prev.specs,
            packages: p.packages || prev.packages,
            variants: p.variants || prev.variants
          }));
          if (p.variants?.length) {
            setSelectedVariant(p.variants[0]);
          }
        }
      })
      .catch(console.error);
  }, [id]);

  const packages: Pkg[] = item.packages && item.packages.length > 0 ? item.packages : [{ kg: 1, price: item.pricePerKg }];
  const variants = item.variants || [];
  const pkg = packages.find(x => x.kg === selectedKg) || packages[0];
  const singlePackTotal = pkg.price;
  const grandTotal = singlePackTotal * quantity;

  const whatsappMessage = encodeURIComponent(
    `Merhaba, Ardabey Sucukları web sitesinden "${item.name}"${variants.length > 1 ? ` (${selectedVariant || variants[0]})` : ""} ürününü ${quantity} adet (${pkg.kg} KG x ${quantity} = ${pkg.kg * quantity} KG) sipariş vermek istiyorum.`
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
                <span className="text-3xl font-black text-amber-400">{item.pricePerKg} ₺</span>
                <span className="text-sm text-neutral-400">/ Kilogram (1 KG başlangıç)</span>
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

              {/* Variant Selector */}
              {variants.length > 1 && (
                <div className="mb-5">
                  <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-3">
                    Seçenek (Acılı / Acısız):
                  </h3>
                  <div className="grid grid-cols-2 gap-3 max-w-xs">
                    {variants.map((v) => (
                      <button
                        key={v}
                        onClick={() => setSelectedVariant(v)}
                        className={`py-3 text-sm font-bold rounded-xl border transition-all ${
                          selectedVariant === v
                            ? "bg-red-600 text-white border-red-500 shadow-lg shadow-red-900/30"
                            : "bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border-neutral-800"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Package Selection */}
              <div className="mb-6 bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Paket Ağırlığı Seçiniz:
                  </span>
                  <span className="text-xs text-neutral-400 font-medium">Seçili: {pkg.kg} KG</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {packages.map((opt) => (
                    <button
                      key={opt.kg}
                      onClick={() => setSelectedKg(opt.kg)}
                      className={`relative py-3 text-xs font-bold rounded-xl border transition-all ${
                        selectedKg === opt.kg
                          ? "bg-amber-500 text-neutral-950 border-amber-400 font-black shadow-lg shadow-amber-500/20 scale-105"
                          : "bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800"
                      }`}
                    >
                      {opt.kg} KG
                      {opt.gift ? (
                        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-neutral-950 text-[10px] font-black">
                          {opt.gift}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
                {pkg.gift ? (
                  <p className="text-[11px] text-emerald-400 mt-3 font-semibold flex items-center gap-1">
                    <Gift className="h-3.5 w-3.5" />
                    Bu pakette {pkg.gift} KG hediye sucuk dahildir.
                  </p>
                ) : null}
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
                  <span className="text-xs text-neutral-500">({quantity} Adet x {pkg.kg} KG = {quantity * pkg.kg} KG)</span>
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
                    image: item.image
                  }, pkg, quantity, variants.length > 1 ? (selectedVariant || variants[0]) : undefined, e)}
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
