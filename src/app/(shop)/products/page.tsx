"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { Star, ShoppingBag, Sparkles, ShieldCheck, Flame, ArrowRight } from "lucide-react";

interface Product {
  id: number;
  name: string;
  tag: string;
  desc?: string;
  description?: string;
  pricePerKg: number;
  img?: string;
  imageUrl?: string;
  rating: number;
  reviews?: number;
  reviewsCount?: number;
}

const defaultProducts: Product[] = [
  { 
    id: 1, 
    name: "Özel Afyon Kangal Sucuk", 
    tag: "Geleneksel Klasik",
    desc: "%100 yerli dana eti ve Afyonkarahisar'ın meşhur baharat harmanı ile asırlık reçeteyle doldurulmuştur.",
    pricePerKg: 590, 
    imageUrl: "/uploads/1790690304656_sucuk_duzenleme_07_UHD.jpg",
    rating: 4.9,
    reviews: 340
  },
  { 
    id: 2, 
    name: "Gurme Acılı Parmak Sucuk", 
    tag: "Acı Severlere Özel",
    desc: "Özel kurutulmuş Maraş pul biberi ve sarımsak dengesiyle mangalda ve sahanda çıtırdayan lezzet.",
    pricePerKg: 620, 
    imageUrl: "/uploads/1790690316545_sucuk_duzenleme_19_UHD.jpg",
    rating: 4.8,
    reviews: 195
  },
  { 
    id: 3, 
    name: "Geleneksel Ev Tipi Doğal Fermente Sucuk", 
    tag: "Katkısız %100 Doğal",
    desc: "Hızlı fırınlama veya ısıl işlem görmemiş, 21 gün serin kurutma odalarında fermente edilmiş gurme sucuk.",
    pricePerKg: 680, 
    imageUrl: "/uploads/1790690334386_sucuk_duzenleme_14_UHD.jpg",
    rating: 5.0,
    reviews: 210
  },
  { 
    id: 4, 
    name: "Özel Dilimli Pratik Kangal Sucuk", 
    tag: "Taze Dilim",
    desc: "Hijyenik koşullarda eşit dilimlenmiş, tost ve kahvaltı için anında kullanıma hazır tazeliği kilitli paket.",
    pricePerKg: 640, 
    imageUrl: "/uploads/1790690350599_sucuk_duzenleme_16_UHD.jpg",
    rating: 4.7,
    reviews: 88
  }
];

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [productList, setProductList] = useState<Product[]>(defaultProducts);
  const [selectedKg, setSelectedKg] = useState<Record<number, number>>({
    1: 3,
    2: 1,
    3: 5,
    4: 1
  });

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
            const kg = selectedKg[p.id] || 1;
            const discount = kg >= 5 ? 50 : 0;
            const finalTotal = (p.pricePerKg - discount) * kg;
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
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-md">
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

                  {/* Weight Selector */}
                  <div className="mb-6 bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-neutral-300">KG Seçimi:</span>
                      {kg >= 5 && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          Kg Başı 50 ₺ İndirim!
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 3, 5, 10, 20].map((weight) => (
                        <button
                          key={weight}
                          onClick={() => handleKg(p.id, weight)}
                          className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                            kg === weight
                              ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/20 font-black"
                              : "bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800"
                          }`}
                        >
                          {weight} KG
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="pt-4 border-t border-neutral-800">
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-xs text-neutral-400 font-medium">{kg} KG Toplam Tutar:</span>
                    <span className="text-3xl font-black text-white">{finalTotal.toLocaleString("tr-TR")} ₺</span>
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
                        pricePerKg: p.pricePerKg,
                        image: productImage
                      }, kg, 1, e)}
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
