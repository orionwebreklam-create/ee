"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useUserAuth } from "@/context/UserAuthContext";
import { 
  PhoneCall, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  Flame, 
  ChevronDown, 
  LogIn, 
  UserPlus, 
  Settings, 
  Headphones,
  Sparkles,
  MessageCircle,
  Package,
  Tag,
  Info,
  MapPin,
  ChevronRight
} from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>("/uploads/logo.png");
  const { cartCount, isCartBumping } = useCart();
  const { user, logout: userLogout, isAuthenticated: isUserLoggedIn } = useUserAuth();

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.settings?.logoUrl) {
          setLogoUrl(data.settings.logoUrl);
        }
      })
      .catch(console.error);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full max-w-full transition-all">
      {/* 1. Top Announcement & Support Bar */}
      <div className="bg-neutral-950 border-b border-neutral-800/80 text-xs py-1 sm:py-1.5 px-2.5 sm:px-4 w-full max-w-full overflow-hidden">
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center gap-2">
          
          {/* Left: Free delivery badge (compact & cleanly truncated on mobile) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 text-neutral-300 text-[11px] sm:text-xs min-w-0 flex-1 overflow-hidden">
            <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse shrink-0" />
            <p className="truncate">
              <span className="hidden sm:inline">
                ⚡ <strong className="text-amber-400">Afyon Fabrika Satış:</strong> 3 Kg ve Üzeri <span className="underline decoration-amber-500/50">Ücretsiz Soğuk Zincir Kargo</span>
              </span>
              <span className="sm:hidden font-medium text-[11px]">
                ⚡ <strong className="text-amber-400">3 Kg ve Üzeri</strong> Ücretsiz Kargo
              </span>
            </p>
          </div>

          {/* Right: Modern Müşteri Destek Merkezi */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <a 
              href="tel:08503081923" 
              className="flex items-center space-x-1 sm:space-x-1.5 bg-neutral-900/90 hover:bg-neutral-800 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-amber-500/30 text-amber-400 transition-all text-[10px] sm:text-xs font-bold shrink-0 whitespace-nowrap"
              title="0850 308 19 23 - Müşteri Destek"
            >
              <Headphones className="h-3 w-3 text-red-500 shrink-0" />
              <span className="hidden md:inline text-neutral-400 font-normal">Destek:</span>
              <span className="tracking-tight">0850 308 19 23</span>
            </a>

            <div className="hidden xl:flex items-center space-x-2 text-neutral-400 text-xs border-l border-neutral-800 pl-3">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="h-3 w-3" /> %100 Afyon Sucuğu
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="dark-glass border-b border-amber-500/20 shadow-2xl w-full max-w-full">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex justify-between items-center gap-2">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3.5 group min-w-0 shrink">
            {logoUrl ? (
              <div className="relative flex h-10 w-10 sm:h-13 sm:w-13 shrink-0 items-center justify-center rounded-2xl bg-neutral-950/90 p-0.5 border border-amber-500/30 shadow-lg shadow-amber-500/10 group-hover:border-amber-400 group-hover:shadow-amber-500/30 transition-all duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoUrl}
                  alt="Ardabey Sucukları"
                  className="h-full w-full object-contain filter drop-shadow group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="relative flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-yellow-700 p-0.5 shadow-lg shadow-amber-500/10 group-hover:shadow-amber-500/30 transition-all">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-neutral-950">
                  <Flame className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 group-hover:scale-110 transition-transform" />
                </div>
              </div>
            )}
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link 
              href="/" 
              className="px-3.5 py-2 text-sm font-semibold text-neutral-200 hover:text-amber-400 rounded-lg transition-colors hover:bg-neutral-800/40"
            >
              Anasayfa
            </Link>
            <Link 
              href="/products" 
              className="px-3.5 py-2 text-sm font-semibold text-neutral-200 hover:text-amber-400 rounded-lg transition-colors hover:bg-neutral-800/40 flex items-center gap-1.5"
            >
              <span>Ürünlerimiz</span>
              <span className="bg-red-600 text-[10px] text-white px-1.5 py-0.2 rounded font-bold">3 Çeşit</span>
            </Link>
            <Link 
              href="/campaigns" 
              className="px-3.5 py-2 text-sm font-semibold text-neutral-200 hover:text-amber-400 rounded-lg transition-colors hover:bg-neutral-800/40"
            >
              Kampanyalar
            </Link>
            <Link 
              href="/about" 
              className="px-3.5 py-2 text-sm font-semibold text-neutral-200 hover:text-amber-400 rounded-lg transition-colors hover:bg-neutral-800/40"
            >
              Hakkımızda
            </Link>
            <Link 
              href="/contact" 
              className="px-3.5 py-2 text-sm font-semibold text-neutral-200 hover:text-amber-400 rounded-lg transition-colors hover:bg-neutral-800/40"
            >
              İletişim
            </Link>
          </nav>

          {/* Action Icons: Giriş / Üye Ol & Cart & Mobile Hamburger */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            
            {/* Giriş / Üye Ol Dropdown (Desktop & Mobile) */}
            <div className="relative">
              <button
                onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                onBlur={() => setTimeout(() => setAuthDropdownOpen(false), 200)}
                className="flex items-center space-x-1.5 sm:space-x-2 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-white px-2.5 sm:px-3.5 py-2 rounded-xl border border-neutral-700/60 transition-all text-xs font-semibold shadow-sm"
                aria-label="Kullanıcı Girişi"
              >
                <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-amber-400/10 text-amber-400 shrink-0">
                  <User className="h-3.5 w-3.5" />
                </div>
                <span className="hidden md:inline truncate max-w-[100px]">
                  {isUserLoggedIn ? user?.name : "Giriş / Üye Ol"}
                </span>
                <ChevronDown className={`h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-200 ${authDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {authDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
                  {isUserLoggedIn ? (
                    <>
                      <div className="px-3 py-2 border-b border-neutral-800 mb-1">
                        <p className="font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-[11px] text-amber-400 truncate">{user?.email}</p>
                      </div>
                      <Link
                        href="/cart"
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-neutral-200 hover:bg-neutral-800 hover:text-amber-400 transition-colors"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span>Siparişlerim</span>
                      </Link>
                      <button
                        onClick={userLogout}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors font-medium text-left"
                      >
                        <LogIn className="h-4 w-4 rotate-180" />
                        <span>Çıkış Yap</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-3 py-2 border-b border-neutral-800 mb-1">
                        <p className="font-semibold text-white">Hoş Geldiniz</p>
                        <p className="text-[11px] text-neutral-400">Sipariş takibi veya yeni hesap</p>
                      </div>
                      <Link
                        href="/login"
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-neutral-200 hover:bg-neutral-800 hover:text-amber-400 transition-colors"
                      >
                        <LogIn className="h-4 w-4" />
                        <span>Müşteri Girişi</span>
                      </Link>
                      <Link
                        href="/register"
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-neutral-200 hover:bg-neutral-800 hover:text-amber-400 transition-colors"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Yeni Üye Kaydı</span>
                      </Link>
                    </>
                  )}
                  <div className="my-1 border-t border-neutral-800/80" />
                  <Link
                    href="/admin"
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-amber-400/90 hover:bg-amber-400/10 transition-colors font-semibold"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Yönetim Paneli (Admin)</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <Link
              id="header-cart-icon"
              href="/cart"
              className={`relative flex items-center space-x-2 bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-600 hover:to-red-500 text-white px-3 sm:px-4 py-2 rounded-xl font-bold text-xs shadow-lg shadow-red-900/30 transition-all hover:scale-105 active:scale-95 ${
                isCartBumping ? "animate-cart-bump ring-2 ring-amber-400 ring-offset-2 ring-offset-neutral-950" : ""
              }`}
            >
              <div className="relative">
                <ShoppingBag className="h-4 w-4" />
                <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-neutral-950 font-black text-[10px] ring-2 ring-neutral-900">
                  {cartCount}
                </span>
              </div>
              <span className="hidden sm:inline">Sepetim</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Mobil Menüyü Aç"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

        </div>
      </div>

      {/* 3. Full Mobile Responsive Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop Blur Overlay */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
          />

          {/* Right Slide-in Drawer */}
          <div className="fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm bg-neutral-950 border-l border-amber-500/20 shadow-2xl flex flex-col justify-between p-5 overflow-y-auto animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-5">
                <div className="flex items-center space-x-2.5">
                  {logoUrl ? (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-900 border border-amber-500/40 p-0.5 shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logoUrl} alt="Logo" className="h-full w-full object-contain" />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-neutral-950 font-black">
                      <Flame className="h-5 w-5 text-red-700" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                  aria-label="Kapat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Account Quick Card inside Drawer */}
              <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-3.5 mb-5">
                {isUserLoggedIn ? (
                  <div>
                    <div className="flex items-center space-x-2.5 mb-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                        <p className="text-[10px] text-amber-400 truncate">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        userLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-xl text-xs font-bold border border-red-800/40 transition"
                    >
                      Oturumu Kapat (Çıkış)
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Müşteri Hesabı</p>
                          <p className="text-[10px] text-neutral-400">Giriş yap veya kaydol</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2 text-center rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold"
                      >
                        Giriş Yap
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2 text-center rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
                      >
                        Üye Ol
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Links with Icons */}
              <nav className="space-y-1.5">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl text-neutral-200 hover:text-white hover:bg-neutral-900 transition-colors"
                >
                  <span className="text-sm font-semibold">Anasayfa</span>
                  <ChevronRight className="h-4 w-4 text-neutral-500" />
                </Link>

                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl text-neutral-200 hover:text-white hover:bg-neutral-900 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold">Sucuk Çeşitlerimiz</span>
                    <span className="bg-red-600 text-[10px] text-white px-1.5 py-0.2 rounded font-bold">3 Çeşit</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-500" />
                </Link>

                <Link
                  href="/campaigns"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl text-neutral-200 hover:text-white hover:bg-neutral-900 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold">Kampanyalar & İndirimler</span>
                    <span className="bg-amber-500/20 text-amber-400 text-[10px] px-1.5 py-0.2 rounded font-bold border border-amber-500/30">Fırsat</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-500" />
                </Link>

                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl text-neutral-200 hover:text-white hover:bg-neutral-900 transition-colors"
                >
                  <span className="text-sm font-semibold">Hakkımızda & Kalite</span>
                  <ChevronRight className="h-4 w-4 text-neutral-500" />
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl text-neutral-200 hover:text-white hover:bg-neutral-900 transition-colors"
                >
                  <span className="text-sm font-semibold">İletişim & Fabrika Satış</span>
                  <ChevronRight className="h-4 w-4 text-neutral-500" />
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl text-neutral-200 hover:text-white hover:bg-neutral-900 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold">Sepetim</span>
                    <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {cartCount} Ürün
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-500" />
                </Link>

                <div className="my-2 border-t border-neutral-800" />

                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-amber-400 hover:bg-amber-400/10 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>Yönetim Paneli (Admin)</span>
                </Link>
              </nav>
            </div>

            {/* Drawer Footer: Call Center & WhatsApp */}
            <div className="pt-6 border-t border-neutral-800 space-y-2.5">
              <a
                href="tel:08503081923"
                className="flex items-center justify-center space-x-2 w-full py-3 bg-neutral-900 hover:bg-neutral-800 border border-amber-500/30 rounded-xl text-amber-400 font-bold text-xs transition-colors"
              >
                <Headphones className="h-4 w-4 text-red-500" />
                <span>Müşteri Destek: 0850 308 19 23</span>
              </a>

              <a
                href="https://wa.me/905321234567?text=Merhaba,%20Ardabey%20Sucukları%20siparişi%20vermek%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/30 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Sipariş Hattı</span>
              </a>

              <p className="text-[10px] text-center text-neutral-500 pt-1">
                %100 Afyon Sucuğu • Afyonkarahisar
              </p>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
