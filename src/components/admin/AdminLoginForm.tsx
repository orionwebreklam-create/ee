"use client";

import { useState } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Flame, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminLoginForm() {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = login(email, password);
    if (!success) {
      setError("Hatalı kullanıcı adı veya şifre!");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center p-4 relative overflow-hidden text-neutral-100">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 group mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-amber-600 to-yellow-700 p-0.5 shadow-xl shadow-amber-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-neutral-950">
                <Flame className="h-7 w-7 text-red-600 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black tracking-wider text-white">ARDABEY</span>
                <span className="text-2xl font-light tracking-wider text-amber-400">SUCUKLARI</span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-semibold">
                Yönetim Paneli Girişi
              </span>
            </div>
          </Link>

          <p className="text-xs text-neutral-400">
            Siparişleri, ürünleri ve site ayarlarını yönetmek için giriş yapın.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 text-xs font-semibold animate-in fade-in duration-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs" autoComplete="off">
            <div>
              <label className="block font-bold text-neutral-300 mb-1.5">Yönetici E-Posta / Kullanıcı Adı</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  required
                  autoComplete="off"
                  name="admin_username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-amber-400 transition-colors"
                  placeholder="E-posta adresiniz"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-neutral-300 mb-1.5">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  name="admin_password"
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

            <div className="flex items-center text-[11px] text-neutral-400 pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-amber-500 rounded" />
                <span>Oturumu Açık Tut</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-xl shadow-red-900/40 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center space-x-2"
            >
              <span>Güvenli Giriş Yap</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-neutral-500 flex items-center justify-center space-x-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>256-Bit SSL Şifreli Yetkili Yönetim Erişimi</span>
          <span>•</span>
          <Link href="/" className="text-neutral-400 hover:text-amber-400 transition underline">
            Siteye Dön
          </Link>
        </div>

      </div>
    </div>
  );
}
