"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { Star, ShoppingBag, Sparkles, Gift } from "lucide-react";

interface Pkg {
  kg: number;
  price: number;
  gift?: number;
}

interface Product {
  id: number;
  name: string;
  tag: string;
  tagColor?: string;
  desc?: string;
  description?: string;
  pricePerKg: number;
  img?: string;
  imageUrl?: string;
  rating: number;
  reviews?: number;
  reviewsCount?: number;
  packages?: Pkg[];
  variants?: string[];
}

const defaultProducts: Product[] = [
  { 
    id: 1, 
    name: "Afyon Sucuğu", 
    tag: "En Çok Satan",
    tagColor: "bg-red-600 text-white",
    description: "Doğal bağırsakta 21 gün fermente edilmiş, sarımsak ve Afyon baharatlarıyla yoğrulmuş hakiki lezzet.",
    pricePerKg: 350, 
    imageUrl: "/uploads/1790690304656_sucuk_duzenleme_07_UHD.jpg",
    rating: 4.9,
    reviewsCount: 328,
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
    pricePerKg: 400, 
    imageUrl: "/uploads/1790690316545_sucuk_duzenleme_19_UHD.jpg",
    rating: 4.8,
    reviewsCount: 184,
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
    pricePerKg: 550, 
    imageUrl: "/uploads/1790690334386_sucuk_duzenleme_14_UHD.jpg",
    rating: 4.9,
    reviewsCount: 146,
    packages: [
      { kg: 1, price: 550 },
      { kg: 5, price: 2750 },
      { kg: 7, price: 3850 },
      { kg: 10, price: 5500 }
    ]
  }
];

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [productList, setProductList] = useState<Product[]>(defaultProducts);
  const [selectedKg, setSelectedKg] = useState<Record<number, number>>({});
  const [selectedVariant, setSelectedVariant] = useState<Record<number, string>>({});

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        if (data.products && data.products.length > 0) {
          setProductList(data.products);
        }
      })
      .catch(console.error);
  }, []);

  const handleKg = (pId: number, kg: number) => {
    setSelectedKg(prev => ({ ...prev, [pId]: kg }));
  };

  const handleVariant = (pId: number, v: string) => {
    setSelectedVariant(prev => ({ ...prev, [pId]: v }));
  };

  return (
    <div className="bg-neutral-950 min-h-screen py-16 text-neutral-100">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-900 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Afyon Fabrika Satış Kataloğu</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            ARDABEY <span className="gold-gradient-text">SUCUK ÇEŞİTLERİ</span>
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base mt-3">
            Tüm ürünlerimiz soğuk zincir strafor kutularda buz aküsü ile 24 saat içinde kapınıza ulaştırılır.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productList.map((p) => {
            const packages = p.packages && p.packages.length > 0 ? p.packages : [{ kg: 1, price: p.pricePerKg }];
            const kg = selectedKg[p.id] || packages[0].kg;
            const pkg = packages.find(x => x.kg === kg) || packages[0];
            const variants = p.variants || [];
            const variant = selectedVariant[p.id] || variants[0];
            const productImage = p.imageUrl || p.img || "/uploads/1790690304656_sucuk_duzenleme_07_UHD.jpg";

            return (
              <div 
                key={p.id}
                className="bg-neutral-900/90 rounded-3xl border border-neutral-800 hover:border-amber-500/40 p-6 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:scale-[1.01]"
              >
                <div>
                  <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-neutral-950 mb-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={productImage} 
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${p.tagColor || "bg-red-600 text-white"}`}>
                        {p.tag}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center bg-neutral-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-neutral-800 text-xs">
                      <span className="text-neutral-300">Birim Kg Fiyatı:</span>
                      <span className="font-bold text-amber-400">{p.pricePerKg} ₺</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 mb-2 text-amber-400">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-white">{p.rating || 5.0}</span>
                    <span className="text-xs text-neutral-500">({p.reviewsCount || p.reviews || 120} Sipariş)</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    <Link href={`/products/${p.id}`} className="hover:text-amber-400 transition-colors">
                      {p.name}
                    </Link>
                  </h3>
                  
                  <p className="text-neutral-400 text-xs leading-relaxed mb-6">
                    {p.description || p.desc}
                  </p>

                  {/* Variant Selector (acılı/acısız) */}
                  {variants.length > 1 && (
                    <div className="mb-4">
                      <span className="text-xs font-bold text-neutral-300 block mb-2">Seçenek:</span>
                      <div className="grid grid-cols-2 gap-2">
                        {variants.map((v) => (
                          <button
                            key={v}
                            onClick={() => handleVariant(p.id, v)}
                            className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                              variant === v
                                ? "bg-red-600 text-white border-red-500 shadow-md"
                                : "bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border-neutral-800"
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Package Selector */}
                  <div className="mb-6 bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-neutral-300">Paket Seçimi:</span>
                      {pkg.gift ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <Gift className="h-3 w-3 inline mr-0.5" /> +{pkg.gift} KG Hediye
                        </span>
                      ) : null}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {packages.map((opt) => (
                        <button
                          key={opt.kg}
                          onClick={() => handleKg(p.id, opt.kg)}
                          className={`relative py-2 text-xs font-bold rounded-xl border transition-all ${
                            kg === opt.kg
                              ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/20 font-black"
                              : "bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800"
                          }`}
                        >
                          {opt.kg} KG
                          {opt.gift ? (
                            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-neutral-950 text-[9px] font-black">
                              {opt.gift}
                            </span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="pt-4 border-t border-neutral-800">
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-xs text-neutral-400 font-medium">{kg} KG Toplam Tutar:</span>
                    <span className="text-3xl font-black text-white">{pkg.price.toLocaleString("tr-TR")} ₺</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href={`/products/${p.id}`}
                      className="py-3 px-4 text-center text-xs font-semibold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors"
                    >
                      İncele
                    </Link>
                    <button
                      onClick={(e) => addToCart({
                        id: p.id,
                        name: p.name,
                        image: productImage
                      }, pkg, 1, variants.length > 1 ? variant : undefined, e)}
                      className="flex items-center justify-center space-x-2 py-3 px-4 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Sepete Ekle</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
