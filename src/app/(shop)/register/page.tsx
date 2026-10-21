"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserAuth } from "@/context/UserAuthContext";
import { 
  Lock, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  Eye, 
  EyeOff, 
  Flame, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2,
  Sparkles
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useUserAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "İstanbul",
    district: "Kadıköy",
    password: "",
    confirmPassword: ""
  });

  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreeMarketing, setAgreeMarketing] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError("Lütfen zorunlu alanları eksiksiz doldurunuz.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Şifreniz en az 6 karakter olmalıdır.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Girdiğiniz şifreler birbiriyle uyuşmuyor.");
      return;
    }

    if (!agreeTerms) {
      setError("Lütfen Kullanıcı Sözleşmesini ve KVKK metnini onaylayınız.");
      return;
    }

    const ok = register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      pass: formData.password,
      city: formData.city,
      district: formData.district
    });

    if (ok) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 1500);
    }
  };

  const handleDemoFill = () => {
    setFormData({
      name: "Murat Yılmaz",
      email: "murat.yilmaz@gmail.com",
      phone: "0532 987 65 43",
      city: "Afyonkarahisar",
      district: "Merkez",
      password: "ardabey123",
      confirmPassword: "ardabey123"
    });
  };

  return (
    <div className="bg-neutral-950 min-h-[90vh] py-12 sm:py-16 text-neutral-100 flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-center">
        
        {/* Left Side: Brand Benefits (5 cols) */}
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
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold block">Ayrıcalıklı Üyelik</span>
              </div>
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight mb-4 leading-snug">
              Ardabey Ailesine Katılın, <br />
              <span className="gold-gradient-text">Özel İndirimleri Yakalayın</span>
            </h2>

            <p className="text-xs text-neutral-400 leading-relaxed mb-6">
              Sadece 30 saniyede üye olun; tescilli Afyon sucuğunu fabrika çıkış tazeliğinde kapınıza getirelim.
            </p>

            <div className="space-y-4 text-xs border-t border-neutral-800/80 pt-5">
              <div className="flex items-start space-x-3 text-neutral-300">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">İlk Siparişe Özel İndirim</span>
                  <span className="text-neutral-400 text-[11px]">Üyelerimize özel kupon ve dönemsel kampanyalar</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-neutral-300">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Tek Tıkla Sipariş Kolaylığı</span>
                  <span className="text-neutral-400 text-[11px]">Adres ve fatura bilgilerinizi kaydedin</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-neutral-300">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Canlı Sipariş & Kargo Bildirimi</span>
                  <span className="text-neutral-400 text-[11px]">Soğuk zincir paketinizin nerede olduğunu anlık görün</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-neutral-800 flex items-center space-x-2 text-[11px] text-neutral-500">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Kişisel Verileriniz KVKK Güvencesi Altındadır</span>
          </div>
        </div>

        {/* Right Side: Register Form (7 cols) */}
        <div className="lg:col-span-7 bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-black text-white">Yeni Üye Kaydı</h1>
              <p className="text-xs text-neutral-400 mt-1">Formu doldurarak hemen Ardabey üyeliğinizi başlatın.</p>
            </div>
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-[10px] font-bold text-amber-400 hover:underline bg-neutral-950 px-2.5 py-1.5 rounded-lg border border-amber-500/30 flex items-center gap-1"
            >
              <Sparkles className="h-3 w-3" />
              <span>Örnek Doldur</span>
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 text-xs font-semibold animate-in fade-in duration-200">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Üyeliğiniz başarıyla oluşturuldu! Yönlendiriliyorsunuz...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            
            {/* Ad Soyad */}
            <div>
              <label className="block font-bold text-neutral-300 mb-1">Adınız Soyadınız *</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-amber-400"
                  placeholder="Ahmet Yılmaz"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-neutral-300 mb-1">E-Posta Adresi *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    placeholder="ornek@mail.com"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Cep Telefonu *</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    placeholder="05XX XXX XX XX"
                  />
                </div>
              </div>
            </div>

            {/* City & District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-neutral-300 mb-1">Şehir</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    placeholder="Afyonkarahisar / İstanbul"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">İlçe</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400"
                  placeholder="İlçe"
                />
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-neutral-300 mb-1">Şifre *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-10 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    placeholder="En az 6 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Şifre Tekrarı *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    placeholder="Şifreyi onaylayın"
                  />
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2 pt-2">
              <label className="flex items-start space-x-2 text-[11px] text-neutral-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 accent-amber-500 rounded"
                />
                <span>
                  <strong className="text-white">Kullanıcı Sözleşmesi</strong> ve <strong className="text-white">KVKK Aydınlatma Metnini</strong> okudum, kabul ediyorum.
                </span>
              </label>

              <label className="flex items-start space-x-2 text-[11px] text-neutral-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeMarketing}
                  onChange={(e) => setAgreeMarketing(e.target.checked)}
                  className="mt-0.5 accent-amber-500 rounded"
                />
                <span>Özel sucuk indirimleri ve kampanyalarından SMS ve E-posta ile haberdar olmak istiyorum.</span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full mt-2 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-xl shadow-red-900/40 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center space-x-2"
            >
              <span>Hesabımı Oluştur & Giriş Yap</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Bottom Switch to Login */}
          <div className="mt-6 pt-5 border-t border-neutral-800 text-center text-xs text-neutral-400">
            <span>Zaten bir hesabınız var mı? </span>
            <Link href="/login" className="text-amber-400 font-bold hover:underline">
              Giriş Yapın →
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
