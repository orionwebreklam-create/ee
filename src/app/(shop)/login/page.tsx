"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserAuth } from "@/context/UserAuthContext";
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Flame, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2,
  Package,
  Truck
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user } = useUserAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Lütfen e-posta adresinizi ve şifrenizi giriniz.");
      return;
    }

    const ok = login(email, password);
    if (ok) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 1200);
    } else {
      setError("Giriş yapılamadı. Lütfen bilgilerinizi kontrol ediniz.");
    }
  };

  const handleDemoLogin = () => {
    login("ahmet.yilmaz@gmail.com", "123456");
    setSuccess(true);
    setTimeout(() => {
      router.push("/");
    }, 1200);
  };

  if (isAuthenticated && !success) {
    return (
      <div className="bg-neutral-950 min-h-[70vh] flex items-center justify-center py-16 text-neutral-100">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Zaten Giriş Yaptınız</h2>
          <p className="text-xs text-neutral-400 mb-6">
            Hoş geldiniz, <strong className="text-amber-400">{user?.name}</strong>. Siparişlerinizi takip edebilir veya alışverişe devam edebilirsiniz.
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <Link
              href="/"
              className="py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition"
            >
              Anasayfaya Dön
            </Link>
            <Link
              href="/cart"
              className="py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-xl border border-neutral-700 transition"
            >
              Sepetime Git
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-950 min-h-[85vh] py-12 sm:py-16 text-neutral-100 flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-center">
        
        {/* Left Side: Brand & Benefits Banner (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-neutral-900 via-neutral-900 to-red-950/40 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-yellow-700 p-0.5 shadow-lg shadow-amber-500/20">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-neutral-950">
                  <Flame className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div>
                <span className="text-xl font-black tracking-wider text-white block">ARDABEY</span>
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold block">Üye Girişi</span>
              </div>
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight mb-4 leading-snug">
              Afyon&apos;un Hakiki Lezzeti <br />
              <span className="gold-gradient-text">Tek Tıkla Kapınızda</span>
            </h2>

            <p className="text-xs text-neutral-400 leading-relaxed mb-6">
              Ardabey Sucukları üye hesabınızla siparişlerinizi soğuk zincir teslimatına kadar anlık takip edebilirsiniz.
            </p>

            <div className="space-y-3.5 text-xs border-t border-neutral-800/80 pt-5">
              <div className="flex items-center space-x-3 text-neutral-300">
                <div className="h-7 w-7 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
                  <Package className="h-3.5 w-3.5" />
                </div>
                <span>Hızlı Sipariş & Kayıtlı Adresler</span>
              </div>

              <div className="flex items-center space-x-3 text-neutral-300">
                <div className="h-7 w-7 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-red-500 shrink-0">
                  <Truck className="h-3.5 w-3.5" />
                </div>
                <span>Soğuk Zincir Kargo Durum Takibi</span>
              </div>

              <div className="flex items-center space-x-3 text-neutral-300">
                <div className="h-7 w-7 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-emerald-400 shrink-0">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <span>Üyelere Özel Kg İndirim Fırsatları</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-neutral-800 flex items-center space-x-2 text-[11px] text-neutral-500">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>256-Bit SSL Korumalı Güvenli Giriş</span>
          </div>
        </div>

        {/* Right Side: Login Form (7 cols) */}
        <div className="lg:col-span-7 bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white">Müşteri Girişi</h1>
            <p className="text-xs text-neutral-400 mt-1">Hesabınıza giriş yaparak alışverişinize devam edin.</p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 text-xs font-semibold animate-in fade-in duration-200">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Giriş başarılı! Anasayfaya yönlendiriliyorsunuz...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-neutral-300 mb-1.5">E-Posta Adresi</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-amber-400 transition-colors"
                  placeholder="ornek@mail.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block font-bold text-neutral-300">Şifre</label>
                <button
                  type="button"
                  onClick={() => alert("Şifre sıfırlama linki e-posta adresinize gönderildi.")}
                  className="text-[11px] text-amber-400/90 hover:underline font-semibold"
                >
                  Şifremi Unuttum?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-10 py-3 text-white focus:outline-none focus:border-amber-400 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-neutral-500 hover:text-neutral-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-neutral-400 text-xs pt-1">
              <input type="checkbox" id="rememberMe" defaultChecked className="accent-amber-500 rounded" />
              <label htmlFor="rememberMe" className="cursor-pointer">Oturumumu bu cihazda açık tut</label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-xl shadow-red-900/40 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center space-x-2"
            >
              <span>Giriş Yap</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Demo Login */}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Hızlı Demo Girişi Yap (Ahmet Yılmaz)</span>
            </button>
          </div>

          {/* Bottom Switch to Register */}
          <div className="mt-6 pt-6 border-t border-neutral-800 text-center text-xs text-neutral-400">
            <span>Henüz bir hesabınız yok mu? </span>
            <Link href="/register" className="text-amber-400 font-bold hover:underline">
              Hemen Yeni Üye Olun →
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
