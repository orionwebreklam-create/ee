"use client";

import { useState, useEffect } from "react";
import { Save, Upload, Check, Image as ImageIcon, Loader2 } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState("Ardabey Sucukları");
  const [supportPhone, setSupportPhone] = useState("0850 308 19 23");
  const [whatsappPhone, setWhatsappPhone] = useState("+90 532 123 45 67");
  const [logoUrl, setLogoUrl] = useState("");
  const [banner1, setBanner1] = useState("https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1600");
  const [banner2, setBanner2] = useState("https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=1600");
  const [freeShippingKg, setFreeShippingKg] = useState(3);
  const [bulkDiscountKg, setBulkDiscountKg] = useState(5);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          const s = data.settings;
          if (s.siteName) setSiteName(s.siteName);
          if (s.supportPhone) setSupportPhone(s.supportPhone);
          if (s.whatsappPhone) setWhatsappPhone(s.whatsappPhone);
          if (s.logoUrl) setLogoUrl(s.logoUrl);
          if (s.banner1) setBanner1(s.banner1);
          if (s.banner2) setBanner2(s.banner2);
          if (s.freeShippingKg) setFreeShippingKg(s.freeShippingKg);
          if (s.bulkDiscountKg) setBulkDiscountKg(s.bulkDiscountKg);
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName,
          supportPhone,
          whatsappPhone,
          logoUrl,
          banner1,
          banner2,
          freeShippingKg,
          bulkDiscountKg
        })
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Site & Görsel Ayarları</h1>
        <p className="text-xs text-neutral-400 mt-1">Logo, anasayfa bannerları, iletişim numaraları ve kampanya kurgularını güncelleyin.</p>
      </div>

      {saved && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>Ayarlar başarıyla kaydedildi ve anasayfaya yansıtıldı!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs text-neutral-200">
        
        {/* Banner ve Görsel Yönetimi */}
        <div className="bg-neutral-900/90 p-6 rounded-3xl shadow-xl border border-neutral-800">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-red-500" />
            <span>Banner & Logo Yükleme</span>
          </h2>

          <div className="space-y-6">
            <div>
              <ImageUploader
                label="Firma Logosu"
                helperText="Şeffaf PNG veya JPG formatında logo yükleyin"
                currentImageUrl={logoUrl}
                onImageUploaded={(url) => setLogoUrl(url)}
                aspectRatio="square"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <ImageUploader
                  label="Anasayfa Ana Hero Banner (Slayt 1)"
                  helperText="16:9 veya geniş açılı yüksek çözünürlüklü et/sucuk görseli seçin"
                  currentImageUrl={banner1}
                  onImageUploaded={(url) => setBanner1(url)}
                  aspectRatio="banner"
                />
              </div>

              <div>
                <ImageUploader
                  label="Anasayfa İkinci Banner (Slayt 2)"
                  helperText="Soğuk zincir veya üretim görseli seçin"
                  currentImageUrl={banner2}
                  onImageUploaded={(url) => setBanner2(url)}
                  aspectRatio="banner"
                />
              </div>
            </div>
          </div>
        </div>

        {/* İletişim & Destek Ayarları */}
        <div className="bg-neutral-900/90 p-6 rounded-3xl shadow-xl border border-neutral-800">
          <h2 className="text-sm font-bold text-white mb-4">Müşteri Destek & WhatsApp Hatları</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-neutral-300 mb-1">Müşteri Destek Telefonu</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-300 mb-1">WhatsApp Sipariş Hattı Numarası</label>
              <input
                type="text"
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-red-600"
              />
            </div>
          </div>
        </div>

        {/* Kampanya ve Kargo Kuralları */}
        <div className="bg-neutral-900/90 p-6 rounded-3xl shadow-xl border border-neutral-800">
          <h2 className="text-sm font-bold text-white mb-4">Otomatik Kampanya ve Kargo Kuralları</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-neutral-300 mb-1">Ücretsiz Kargo Barajı (KG)</label>
              <input
                type="number"
                value={freeShippingKg}
                onChange={(e) => setFreeShippingKg(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-red-600"
              />
              <p className="text-[11px] text-neutral-500 mt-1">Bu kg ve üzeri sepetlerde kargo otomatik 0 ₺ olur.</p>
            </div>

            <div>
              <label className="block font-bold text-neutral-300 mb-1">Toplu İndirim Eşiği (KG)</label>
              <input
                type="number"
                value={bulkDiscountKg}
                onChange={(e) => setBulkDiscountKg(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-red-600"
              />
              <p className="text-[11px] text-neutral-500 mt-1">Bu kg ve üzeri seçimlerde kg başı 50 ₺ indirim uygulanır.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-900/40 transition-all hover:scale-105"
          >
            <Save className="h-4 w-4" />
            <span>Ayarları Kaydet</span>
          </button>
        </div>

      </form>
    </div>
  );
}
