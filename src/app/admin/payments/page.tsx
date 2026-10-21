"use client";

import { useState, useEffect } from "react";
import { 
  CreditCard, 
  ShieldCheck, 
  Check, 
  Save, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Building2, 
  Banknote, 
  Truck, 
  HelpCircle, 
  Loader2, 
  Sparkles,
  Zap,
  Lock
} from "lucide-react";
import { StoredPaymentSettings, BankAccount } from "@/lib/dataStore";

export default function AdminPaymentsPage() {
  const [settings, setSettings] = useState<StoredPaymentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Visibility toggles for secrets
  const [showIyzicoSecret, setShowIyzicoSecret] = useState(false);
  const [showPaytrKey, setShowPaytrKey] = useState(false);
  const [showPaytrSalt, setShowPaytrSalt] = useState(false);

  // Active section tab
  const [activeTab, setActiveTab] = useState<"iyzico" | "paytr" | "delivery" | "transfer">("iyzico");

  useEffect(() => {
    fetch("/api/payments")
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setSettings(data.settings);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3500);
      } else {
        alert("Ayarlar kaydedilemedi.");
      }
    } catch (err) {
      console.error(err);
      alert("Bağlantı hatası oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddBankAccount = () => {
    if (!settings) return;
    const newAccount: BankAccount = {
      id: `bank-${Date.now()}`,
      bankName: "Yeni Banka",
      accountHolder: "Ardabey Sucukları Ltd. Şti.",
      iban: "TR00 0000 0000 0000 0000 0000 00",
      branch: "Merkez Şube"
    };
    setSettings({
      ...settings,
      bankTransfer: {
        ...settings.bankTransfer,
        accounts: [...settings.bankTransfer.accounts, newAccount]
      }
    });
  };

  const handleRemoveBankAccount = (id: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      bankTransfer: {
        ...settings.bankTransfer,
        accounts: settings.bankTransfer.accounts.filter(a => a.id !== id)
      }
    });
  };

  const handleUpdateBankAccount = (id: string, field: keyof BankAccount, value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      bankTransfer: {
        ...settings.bankTransfer,
        accounts: settings.bankTransfer.accounts.map(a => a.id === id ? { ...a, [field]: value } : a)
      }
    });
  };

  if (loading || !settings) {
    return (
      <div className="py-24 text-center text-neutral-400 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-7 w-7 animate-spin text-amber-400" />
        <span className="text-sm">Ödeme yöntemleri yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Ödeme Yöntemleri & Sanal POS</h1>
          <p className="text-xs text-neutral-400 mt-1">
            İyzico ve PayTR entegrasyonlarını yönetin, kapıda ödeme ve havale seçeneklerini dilediğiniz gibi açıp kapatın.
          </p>
        </div>

        {/* Global Save Button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-900/40 transition-all hover:scale-105 active:scale-95"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Kaydediliyor...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Tüm Ayarları Kaydet</span>
            </>
          )}
        </button>
      </div>

      {/* Success Notification Alert */}
      {savedSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>✓ Ödeme yöntemleri başarıyla kaydedildi ve sepete yansıtıldı!</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 mb-6 border-b border-neutral-800">
        <button
          onClick={() => setActiveTab("iyzico")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "iyzico"
              ? "bg-amber-500 text-neutral-950 shadow-md font-black"
              : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
          }`}
        >
          <CreditCard className="h-4 w-4" />
          <span>İyzico Sanal POS</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
            settings.iyzico.enabled ? "bg-emerald-950 text-emerald-300" : "bg-neutral-800 text-neutral-500"
          }`}>
            {settings.iyzico.enabled ? "Aktif" : "Pasif"}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("paytr")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "paytr"
              ? "bg-amber-500 text-neutral-950 shadow-md font-black"
              : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
          }`}
        >
          <Zap className="h-4 w-4" />
          <span>PayTR Sanal POS</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
            settings.paytr.enabled ? "bg-emerald-950 text-emerald-300" : "bg-neutral-800 text-neutral-500"
          }`}>
            {settings.paytr.enabled ? "Aktif" : "Pasif"}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("delivery")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "delivery"
              ? "bg-amber-500 text-neutral-950 shadow-md font-black"
              : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
          }`}
        >
          <Truck className="h-4 w-4" />
          <span>Kapıda Ödeme</span>
        </button>

        <button
          onClick={() => setActiveTab("transfer")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "transfer"
              ? "bg-amber-500 text-neutral-950 shadow-md font-black"
              : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Havale / EFT Hesapları</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs text-neutral-200">
        
        {/* 1. İYZİCO ENTEGRASYONU */}
        {activeTab === "iyzico" && (
          <div className="bg-neutral-900/90 rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-xl space-y-6 animate-in fade-in duration-200">
            {/* Top Toggle Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-neutral-800">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">İyzico Checkout & 3D Secure</h3>
                  <p className="text-xs text-neutral-400">Mastercard, Visa, Troy ve BKM Express kartları ile güvenli ödeme alma</p>
                </div>
              </div>

              {/* Status Switch */}
              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold text-neutral-300">
                  {settings.iyzico.enabled ? "Durum: AKTİF" : "Durum: PASİF"}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.iyzico.enabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      iyzico: { ...settings.iyzico, enabled: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>

            {/* Test Mode Switch */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="h-5 w-5 text-amber-400" />
                <div>
                  <p className="font-bold text-white text-xs">Sandbox (Test) Modu</p>
                  <p className="text-[11px] text-neutral-500">Gerçek para çekilmeden test kartlarıyla sipariş denemeleri yapmanızı sağlar.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.iyzico.testMode}
                  onChange={(e) => setSettings({
                    ...settings,
                    iyzico: { 
                      ...settings.iyzico, 
                      testMode: e.target.checked,
                      baseUrl: e.target.checked ? "https://sandbox-api.iyzipay.com" : "https://api.iyzipay.com"
                    }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {/* API Credentials */}
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-neutral-300 mb-1.5">
                  İyzico API Key
                </label>
                <input
                  type="text"
                  value={settings.iyzico.apiKey}
                  onChange={(e) => setSettings({
                    ...settings,
                    iyzico: { ...settings.iyzico, apiKey: e.target.value }
                  })}
                  placeholder="sandbox-..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1.5">
                  İyzico Secret Key
                </label>
                <div className="relative">
                  <input
                    type={showIyzicoSecret ? "text" : "password"}
                    value={settings.iyzico.secretKey}
                    onChange={(e) => setSettings({
                      ...settings,
                      iyzico: { ...settings.iyzico, secretKey: e.target.value }
                    })}
                    placeholder="sandbox-secret-..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-red-600 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowIyzicoSecret(!showIyzicoSecret)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                  >
                    {showIyzicoSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1.5">
                  Base API URL
                </label>
                <input
                  type="text"
                  value={settings.iyzico.baseUrl}
                  onChange={(e) => setSettings({
                    ...settings,
                    iyzico: { ...settings.iyzico, baseUrl: e.target.value }
                  })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-400 font-mono text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. PAYTR ENTEGRASYONU */}
        {activeTab === "paytr" && (
          <div className="bg-neutral-900/90 rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-xl space-y-6 animate-in fade-in duration-200">
            {/* Top Toggle Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-neutral-800">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">PayTR iFrame & Sanal POS</h3>
                  <p className="text-xs text-neutral-400">Türkiye&apos;nin en popüler sanal POS altyapısı, taksitli kart çekimleri</p>
                </div>
              </div>

              {/* Status Switch */}
              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold text-neutral-300">
                  {settings.paytr.enabled ? "Durum: AKTİF" : "Durum: PASİF"}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.paytr.enabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      paytr: { ...settings.paytr, enabled: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>

            {/* Test Mode Switch */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="h-5 w-5 text-amber-400" />
                <div>
                  <p className="font-bold text-white text-xs">PayTR Test Modu</p>
                  <p className="text-[11px] text-neutral-500">PayTR mağaza panelindeki test bildirimlerini doğrulamak için kullanılır.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.paytr.testMode}
                  onChange={(e) => setSettings({
                    ...settings,
                    paytr: { ...settings.paytr, testMode: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {/* Credentials Grid */}
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-neutral-300 mb-1.5">
                  Mağaza No (Merchant ID)
                </label>
                <input
                  type="text"
                  value={settings.paytr.merchantId}
                  onChange={(e) => setSettings({
                    ...settings,
                    paytr: { ...settings.paytr, merchantId: e.target.value }
                  })}
                  placeholder="Örn: 482910"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1.5">
                  Mağaza Parola (Merchant Key)
                </label>
                <div className="relative">
                  <input
                    type={showPaytrKey ? "text" : "password"}
                    value={settings.paytr.merchantKey}
                    onChange={(e) => setSettings({
                      ...settings,
                      paytr: { ...settings.paytr, merchantKey: e.target.value }
                    })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-red-600 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPaytrKey(!showPaytrKey)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                  >
                    {showPaytrKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1.5">
                  Mağaza Gizli Anahtar (Merchant Salt)
                </label>
                <div className="relative">
                  <input
                    type={showPaytrSalt ? "text" : "password"}
                    value={settings.paytr.merchantSalt}
                    onChange={(e) => setSettings({
                      ...settings,
                      paytr: { ...settings.paytr, merchantSalt: e.target.value }
                    })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-red-600 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPaytrSalt(!showPaytrSalt)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                  >
                    {showPaytrSalt ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1.5">
                  Maksimum Taksit Sayısı
                </label>
                <select
                  value={settings.paytr.maxInstallments}
                  onChange={(e) => setSettings({
                    ...settings,
                    paytr: { ...settings.paytr, maxInstallments: Number(e.target.value) }
                  })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-red-600"
                >
                  <option value={0}>Sadece Tek Çekim (Taksitsiz)</option>
                  <option value={3}>Maksimum 3 Taksit</option>
                  <option value={6}>Maksimum 6 Taksit</option>
                  <option value={9}>Maksimum 9 Taksit</option>
                  <option value={12}>Maksimum 12 Taksit</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 3. KAPIDA ÖDEME YÖNTEMLERİ */}
        {activeTab === "delivery" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Kapıda Nakit */}
            <div className="bg-neutral-900/90 rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-xl space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
                <div className="flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <Banknote className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">Kapıda Nakit Ödeme</h3>
                    <p className="text-xs text-neutral-400">Kurye siparişi teslim ederken nakit para tahsilatı yapar.</p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.cashOnDelivery.enabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      cashOnDelivery: { ...settings.cashOnDelivery, enabled: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">
                  Kapıda Ödeme Ek Hizmet Bedeli (₺)
                </label>
                <input
                  type="number"
                  value={settings.cashOnDelivery.extraFee}
                  onChange={(e) => setSettings({
                    ...settings,
                    cashOnDelivery: { ...settings.cashOnDelivery, extraFee: Number(e.target.value) }
                  })}
                  className="w-full max-w-xs bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white font-bold focus:outline-none focus:border-red-600"
                  placeholder="0"
                />
                <span className="text-[11px] text-neutral-500 block mt-1">
                  0 yazarsanız müşteriden ek tahsilat ücreti alınmaz.
                </span>
              </div>
            </div>

            {/* Kapıda Kredi Kartı */}
            <div className="bg-neutral-900/90 rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-xl space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
                <div className="flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <Truck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">Kapıda Kredi Kartı / POS ile Ödeme</h3>
                    <p className="text-xs text-neutral-400">Kargo kuryesi mobil POS cihazı ile kapıda kart çekimi yapar.</p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.cardOnDelivery.enabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      cardOnDelivery: { ...settings.cardOnDelivery, enabled: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* 4. HAVALE / EFT VE BANKA HESAPLARI */}
        {activeTab === "transfer" && (
          <div className="bg-neutral-900/90 rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-xl space-y-6 animate-in fade-in duration-200">
            {/* Top Toggle */}
            <div className="flex justify-between items-center pb-6 border-b border-neutral-800">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Banka Havalesi / FAST / EFT</h3>
                  <p className="text-xs text-neutral-400">Müşterinin doğrudan banka hesabınıza para transferi yaparak sipariş vermesi</p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.bankTransfer.enabled}
                  onChange={(e) => setSettings({
                    ...settings,
                    bankTransfer: { ...settings.bankTransfer, enabled: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Bank Accounts List */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-white text-sm">Tanımlı Banka Hesapları</h4>
                <button
                  type="button"
                  onClick={handleAddBankAccount}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold text-xs border border-neutral-700 transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Yeni Banka Hesabı Ekle</span>
                </button>
              </div>

              <div className="space-y-4">
                {settings.bankTransfer.accounts.map((acc, index) => (
                  <div key={acc.id} className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 relative">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" />
                        <span>Hesap #{index + 1}</span>
                      </span>
                      {settings.bankTransfer.accounts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBankAccount(acc.id)}
                          className="text-red-400 hover:text-red-300 text-xs font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Kaldır</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Banka Adı</label>
                        <input
                          type="text"
                          value={acc.bankName}
                          onChange={(e) => handleUpdateBankAccount(acc.id, "bankName", e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Hesap Sahibi (Alıcı)</label>
                        <input
                          type="text"
                          value={acc.accountHolder}
                          onChange={(e) => handleUpdateBankAccount(acc.id, "accountHolder", e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">IBAN Numarası</label>
                        <input
                          type="text"
                          value={acc.iban}
                          onChange={(e) => handleUpdateBankAccount(acc.id, "iban", e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transfer Instructions */}
            <div>
              <label className="block font-bold text-neutral-300 mb-1.5">
                Müşteriye Gösterilecek Havale Talimatı & Açıklama
              </label>
              <textarea
                rows={3}
                value={settings.bankTransfer.instructions}
                onChange={(e) => setSettings({
                  ...settings,
                  bankTransfer: { ...settings.bankTransfer, instructions: e.target.value }
                })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 leading-relaxed text-xs"
              />
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="pt-4 border-t border-neutral-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-900/40 transition-all hover:scale-105 active:scale-95"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Kaydediliyor...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Ödeme Yöntemlerini Kaydet</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
