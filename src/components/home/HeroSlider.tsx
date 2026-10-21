"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Flame, ArrowRight } from "lucide-react";

interface Slide {
  id: number;
  tag: string;
  tagColor: string;
  title: string;
  subtitle: string;
  highlight: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  secondaryCta: string;
  secondaryLink: string;
  bgImage: string;
}

const slides: Slide[] = [
  {
    id: 1,
    tag: "Tescilli Coğrafi İşaret • 1984'ten Beri",
    tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    title: "GERÇEK AFYON",
    highlight: "GELENEKSEL SUCUĞU",
    subtitle: "%100 Dana Eti • Katkısız & Doğal Fermantasyon",
    description: "Özel seçilmiş yerli besi dana etleri ve asırlık baharat reçeteleri ile geleneksel fırınlarda kurutulan eşsiz gurme lezzet.",
    ctaText: "Hemen Sipariş Ver",
    ctaLink: "/products",
    secondaryCta: "Sucuklarımızı İncele",
    secondaryLink: "/products",
    bgImage: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1600"
  },
  {
    id: 2,
    tag: "Aynı Gün Kargoda • Soğuk Zincir",
    tagColor: "bg-red-500/20 text-red-300 border-red-500/40",
    title: "ÇİFTLİKTEN KAPINIZA",
    highlight: "TAZE & SOĞUK ZİNCİR",
    subtitle: "Özel Isı Yalıtımlı Kutular ve Buz Aküleri İle Gönderim",
    description: "Siparişiniz Afyon'daki üretim tesisimizden özel vakumlu ambalajında ve soğuk zinciri kırılmadan 24 saatte adresinize teslim edilir.",
    ctaText: "Kampanyaları Gör",
    ctaLink: "/campaigns",
    secondaryCta: "Nasıl Üretiyoruz?",
    secondaryLink: "/about",
    bgImage: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=1600"
  },
  {
    id: 3,
    tag: "Toplu Alım İndirimleri • 1-3-5-10-20 KG",
    tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    title: "AVANTAJLI AİLE",
    highlight: "VE TOPTAN PAKETLER",
    subtitle: "5 KG ve Üzeri Alımlarda Kiloda 50 ₺ Ek İndirim Fırsatı",
    description: "Dilediğiniz kiloda (1, 3, 5, 10, 20 kg) seçim yapın, sofralarınıza katıksız saf et kalitesini en uygun toptan fiyatlarla taşıyın.",
    ctaText: "Paketleri İncele",
    ctaLink: "/products",
    secondaryCta: "WhatsApp'tan Sipariş",
    secondaryLink: "https://wa.me/905321234567?text=Merhaba,%20toplu%20sucuk%20alımı%20için%20fiyat%20almak%20istiyorum.",
    bgImage: "https://images.unsplash.com/photo-1589304198126-79c2a382101e?auto=format&fit=crop&q=80&w=1600"
  }
];

export default function HeroSlider() {
  const [slideList, setSlideList] = useState<Slide[]>(slides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setSlideList(prev => prev.map(s => {
            if (s.id === 1 && data.settings.banner1) {
              return { ...s, bgImage: data.settings.banner1 };
            }
            if (s.id === 2 && data.settings.banner2) {
              return { ...s, bgImage: data.settings.banner2 };
            }
            return s;
          }));
        }
      })
      .catch(console.error);
  }, []);

  // Auto slide effect
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideList.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, slideList.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slideList.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slideList.length) % slideList.length);

  return (
    <div 
      className="relative h-[580px] sm:h-[640px] md:h-[700px] w-full overflow-hidden bg-neutral-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slideList.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105 pointer-events-none"
            } transition-transform duration-1000`}
          >
            {/* Background Image with Dark Vignette */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-7000 ease-out"
              style={{
                backgroundImage: `url('${slide.bgImage}')`,
                transform: isActive ? "scale(1.05)" : "scale(1.15)",
                transition: "transform 7s ease-out"
              }}
            />
            {/* Dark & Gold Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-neutral-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/60" />

            {/* Content Container */}
            <div className="relative z-20 container mx-auto h-full px-4 sm:px-8 flex flex-col justify-center">
              <div className="max-w-2xl sm:max-w-3xl">
                
                {/* Badge Tag */}
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-semibold mb-5 backdrop-blur-md shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-500">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${slide.tagColor} border`}>
                    {slide.tag}
                  </span>
                </div>

                {/* Main Titles */}
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] mb-4">
                  {slide.title} <br />
                  <span className="gold-gradient-text drop-shadow-md">
                    {slide.highlight}
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-xl font-medium text-amber-300/90 mb-3 flex items-center gap-2">
                  <Flame className="h-5 w-5 text-red-500 shrink-0" />
                  {slide.subtitle}
                </p>

                {/* Description */}
                <p className="text-xs sm:text-base text-neutral-300 max-w-xl mb-8 leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {slide.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href={slide.ctaLink}
                    className="flex items-center space-x-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-600 hover:to-red-500 text-white shadow-xl shadow-red-900/40 hover:scale-105 active:scale-95 transition-all group"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href={slide.secondaryLink}
                    className="flex items-center space-x-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl font-semibold text-sm sm:text-base bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700/80 hover:border-amber-400/50 backdrop-blur-md transition-all"
                  >
                    <span>{slide.secondaryCta}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Controls: Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Önceki Slayt"
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-neutral-900/70 hover:bg-neutral-900 text-white border border-neutral-700/80 hover:border-amber-400 transition-all backdrop-blur-md shadow-xl hover:scale-110"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Sonraki Slayt"
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-neutral-900/70 hover:bg-neutral-900 text-white border border-neutral-700/80 hover:border-amber-400 transition-all backdrop-blur-md shadow-xl hover:scale-110"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators & Progress */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center items-center space-x-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Slayt ${idx + 1}`}
            className={`transition-all duration-300 rounded-full ${
              idx === currentSlide
                ? "w-8 sm:w-10 h-2 bg-gradient-to-r from-amber-400 to-amber-500 shadow-md shadow-amber-400/50"
                : "w-2 sm:w-2.5 h-2 bg-neutral-600 hover:bg-neutral-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
