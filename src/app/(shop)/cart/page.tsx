"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useUserAuth } from "@/context/UserAuthContext";
import { 
  CreditCard, 
  Banknote, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  ShoppingBag,
  UserCheck,
  UserX,
  Trash2,
  Copy,
  Check,
  Building2,
  Sparkles,
  Lock,
  ChevronRight,
  Info
} from "lucide-react";
import { StoredPaymentSettings, BankAccount } from "@/lib/dataStore";

export default function CartPage() {
  const { items, removeFromCart, clearCart, cartTotal } = useCart();
  const { user } = useUserAuth();
  
  // Payment gateway settings from API
  const [paymentSettings, setPaymentSettings] = useState<StoredPaymentSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Selected payment method & details
  const [paymentMethod, setPaymentMethod] = useState<string>("iyzico");
  const [selectedInstallment, setSelectedInstallment] = useState<number>(1);
  const [selectedBankId, setSelectedBankId] = useState<string>("");
  const [copiedIban, setCopiedIban] = useState<string | null>(null);

  // Credit card form state
  const [cardData, setCardData] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: ""
  });

  const [isGuest, setIsGuest] = useState(!user);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderSummaryData, setOrderSummaryData] = useState<{
    orderId: string;
    customerName: string;
    paymentLabel: string;
    total: number;
    bankAccount?: BankAccount;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || "Ahmet Yılmaz",
    phone: user?.phone || "0532 111 22 33",
    email: user?.email || "ahmet@ornek.com",
    city: user?.city || "İstanbul",
    district: user?.district || "Kadıköy",
    address: user?.address || "Bağdat Cad. No: 124 Daire: 5"
  });

  // Fetch payment gateways from API
  useEffect(() => {
    fetch("/api/payments")
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setPaymentSettings(data.settings);
          
          // Select first available method
          if (data.settings.iyzico?.enabled) {
            setPaymentMethod("iyzico");
          } else if (data.settings.paytr?.enabled) {
            setPaymentMethod("paytr");
          } else if (data.settings.cashOnDelivery?.enabled) {
            setPaymentMethod("cash_on_delivery");
          } else if (data.settings.cardOnDelivery?.enabled) {
            setPaymentMethod("cc_on_delivery");
          } else if (data.settings.bankTransfer?.enabled) {
            setPaymentMethod("transfer");
          }

          if (data.settings.bankTransfer?.accounts?.length > 0) {
            setSelectedBankId(data.settings.bankTransfer.accounts[0].id);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoadingSettings(false));
  }, []);

  // Sync if user logs in later
  useEffect(() => {
    if (user) {
      setIsGuest(false);
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        city: user.city || prev.city,
        district: user.district || prev.district
      }));
    }
  }, [user]);

  const totalAmount = cartTotal;

  // Format card number with spaces (#### #### #### ####)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
    setCardData(prev => ({ ...prev, number: formatted }));
  };

  // Format expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      raw = raw.slice(0, 2) + "/" + raw.slice(2, 4);
    }
    setCardData(prev => ({ ...prev, expiry: raw }));
  };

  // Copy IBAN helper
  const handleCopyIban = (iban: string) => {
    navigator.clipboard.writeText(iban.replace(/\s+/g, ""));
    setCopiedIban(iban);
    setTimeout(() => setCopiedIban(null), 2500);
  };

  // Detect card brand
  const getCardBrand = () => {
    const cleaned = cardData.number.replace(/\s+/g, "");
    if (cleaned.startsWith("4")) return "Visa";
    if (cleaned.startsWith("51") || cleaned.startsWith("52") || cleaned.startsWith("53") || cleaned.startsWith("54") || cleaned.startsWith("55") || (parseInt(cleaned.slice(0, 4)) >= 2221 && parseInt(cleaned.slice(0, 4)) <= 2720)) return "Mastercard";
    if (cleaned.startsWith("9792")) return "Troy";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Sepetinizde ürün bulunmamaktadır.");
      return;
    }

    try {
      let paymentLabel = "Kredi Kartı (Online)";
      if (paymentMethod === "iyzico") {
        paymentLabel = "İyzico 3D Secure Sanal POS";
      } else if (paymentMethod === "paytr") {
        paymentLabel = `PayTR Sanal POS (${selectedInstallment === 1 ? 'Tek Çekim' : `${selectedInstallment} Taksit`})`;
      } else if (paymentMethod === "cash_on_delivery") {
        paymentLabel = "Kapıda Nakit Ödeme";
      } else if (paymentMethod === "cc_on_delivery") {
        paymentLabel = "Kapıda Kredi Kartı";
      } else if (paymentMethod === "transfer") {
        const activeBank = paymentSettings?.bankTransfer?.accounts?.find(b => b.id === selectedBankId);
        paymentLabel = `Havale / EFT (${activeBank?.bankName || "Banka Transferi"})`;
      }

      const totalKg = items.reduce((sum, i) => sum + (i.kg * i.quantity), 0);
      const itemsSummary = items.map(i => `${i.name} (${i.kg} KG)`).join(", ");
      const itemsList = items.map(i => ({
        name: i.name,
        kg: i.kg,
        quantity: i.quantity,
        pricePerKg: i.pricePerKg,
        totalPrice: i.totalPrice
      }));

      const generatedOrderId = `#ARD-${Math.floor(100000 + Math.random() * 900000)}`;

      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          district: formData.district,
          items: itemsSummary || "Özel Afyon Sucuğu",
          itemsList,
          kg: totalKg || 1,
          total: cartTotal,
          paymentMethod: paymentLabel
        })
      });

      const selectedBankObj = paymentSettings?.bankTransfer?.accounts?.find(b => b.id === selectedBankId);

      setOrderSummaryData({
        orderId: generatedOrderId,
        customerName: formData.name,
        paymentLabel,
        total: cartTotal,
        bankAccount: selectedBankObj
      });

      setIsSubmitted(true);
      clearCart();
    } catch (err) {
      console.error(err);
      alert("Sipariş verilirken bir hata oluştu. Lütfen tekrar deneyiniz.");
    }
  };

  if (isSubmitted && orderSummaryData) {
    return (
      <div className="bg-neutral-950 min-h-screen py-20 text-neutral-100 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mb-6">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
              <Sparkles className="h-3 w-3" />
              <span>Sipariş Başarıyla Oluşturuldu</span>
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Teşekkürler, Siparişiniz Alındı!</h2>
            <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
              <strong className="text-amber-400">{orderSummaryData.orderId}</strong> numaralı siparişiniz onaylandı. Soğuk zincir kutulama sonrası SMS ve e-posta ile kargo takip kodunuz iletilecektir.
            </p>

            <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 text-xs text-left mb-6 space-y-3">
              <div className="flex justify-between border-b border-neutral-900 pb-2">
                <span className="text-neutral-500">Müşteri Adı:</span>
                <span className="font-semibold text-white">{orderSummaryData.customerName}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-900 pb-2">
                <span className="text-neutral-500">Ödeme Şekli:</span>
                <span className="font-bold text-amber-400">
                  {orderSummaryData.paymentLabel}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-neutral-500">Toplam Tutar:</span>
                <span className="font-black text-white text-base">{orderSummaryData.total.toLocaleString("tr-TR")} ₺</span>
              </div>

              {/* Bank Transfer Instructions If Selected */}
              {paymentMethod === "transfer" && orderSummaryData.bankAccount && (
                <div className="mt-4 pt-4 border-t border-neutral-800 bg-neutral-900/80 p-4 rounded-xl space-y-2">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                    <Building2 className="h-4 w-4" />
                    <span>Havale Yapılacak Hesap ({orderSummaryData.bankAccount.bankName})</span>
                  </div>
                  <div className="text-[11px] text-neutral-300">
                    <p className="font-medium text-white">{orderSummaryData.bankAccount.accountHolder}</p>
                    <div className="flex items-center justify-between bg-neutral-950 px-3 py-2 rounded-lg font-mono text-xs text-amber-300 border border-neutral-800 mt-1.5">
                      <span>{orderSummaryData.bankAccount.iban}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyIban(orderSummaryData.bankAccount!.iban)}
                        className="text-neutral-400 hover:text-white p-1"
                        title="IBAN Kopyala"
                      >
                        {copiedIban === orderSummaryData.bankAccount.iban ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-2">
                      * Açıklama kısmına sipariş kodunuz olan <strong className="text-amber-400">{orderSummaryData.orderId}</strong> yazmayı unutmayınız.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/"
              className="block w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-red-900/30"
            >
              Anasayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Active method helper booleans
  const isIyzicoActive = paymentSettings ? paymentSettings.iyzico?.enabled : true;
  const isPaytrActive = paymentSettings ? paymentSettings.paytr?.enabled : true;
  const isCashOnDeliveryActive = paymentSettings ? paymentSettings.cashOnDelivery?.enabled : true;
  const isCardOnDeliveryActive = paymentSettings ? paymentSettings.cardOnDelivery?.enabled : true;
  const isBankTransferActive = paymentSettings ? paymentSettings.bankTransfer?.enabled : true;

  const activeBank = paymentSettings?.bankTransfer?.accounts?.find(b => b.id === selectedBankId) || paymentSettings?.bankTransfer?.accounts?.[0];

  return (
    <div className="bg-neutral-950 min-h-screen py-12 text-neutral-100">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <Link 
            href="/products" 
            className="inline-flex items-center space-x-2 text-xs font-semibold text-neutral-400 hover:text-amber-400 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Alışverişe Devam Et</span>
          </Link>
          <div className="flex items-center space-x-2 text-xs text-neutral-400">
            <Lock className="h-3.5 w-3.5 text-emerald-400" />
            <span>256-Bit SSL Şifreli Güvenli Ödeme</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-8">
          SEPETİM & <span className="gold-gradient-text">SİPARİŞİ TAMAMLA</span>
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Delivery & Payment Options */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Membership Switch */}
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 shadow-xl">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-3">
                Alışveriş Yöntemi:
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsGuest(true)}
                  className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                    isGuest
                      ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/10"
                      : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white"
                  }`}
                >
                  <UserX className="h-4 w-4" />
                  <span>Üye Olmadan Hızlı Alışveriş</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsGuest(false)}
                  className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                    !isGuest
                      ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/10"
                      : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white"
                  }`}
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Üye Girişi Yaparak Sipariş Ver</span>
                </button>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-amber-400" />
                <span>Teslimat ve İletişim Bilgileri</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1.5">Adınız Soyadınız *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-amber-400 transition"
                    placeholder="Ad Soyad"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-semibold mb-1.5">Telefon Numarası *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-amber-400 transition"
                    placeholder="05XX XXX XX XX"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-neutral-400 font-semibold mb-1.5">E-Posta Adresi (Kargo Takip Bilgisi İçin) *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-amber-400 transition"
                    placeholder="ornek@mail.com"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-semibold mb-1.5">İl *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-amber-400 transition"
                    placeholder="İl"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-semibold mb-1.5">İlçe *</label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-amber-400 transition"
                    placeholder="İlçe"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-neutral-400 font-semibold mb-1.5">Açık Teslimat Adresi *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-amber-400 transition"
                    placeholder="Mahalle, sokak, bina ve daire numarası..."
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Payment Method Selector */}
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-amber-400" />
                  <span>Ödeme Yöntemi Seçin</span>
                </h2>
                <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Korumalı Altyapı</span>
                </span>
              </div>

              {/* Payment Methods Options List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                {/* 1. İyzico Option */}
                {isIyzicoActive && (
                  <label className={`flex items-start space-x-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'iyzico'
                      ? 'border-blue-500 bg-blue-950/20 shadow-md shadow-blue-500/10'
                      : 'border-neutral-800 bg-neutral-950/60 hover:bg-neutral-950'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="iyzico"
                      checked={paymentMethod === 'iyzico'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-0.5 accent-blue-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white block mb-0.5">İyzico Sanal POS</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-blue-600/30 text-blue-300 border border-blue-500/30">
                          3D SECURE
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-400">Mastercard, Visa, Troy ile anında ödeme</span>
                    </div>
                  </label>
                )}

                {/* 2. PayTR Option */}
                {isPaytrActive && (
                  <label className={`flex items-start space-x-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'paytr'
                      ? 'border-emerald-500 bg-emerald-950/20 shadow-md shadow-emerald-500/10'
                      : 'border-neutral-800 bg-neutral-950/60 hover:bg-neutral-950'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paytr"
                      checked={paymentMethod === 'paytr'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-0.5 accent-emerald-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white block mb-0.5">PayTR Sanal POS</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-600/30 text-emerald-300 border border-emerald-500/30">
                          TAKSİTLİ
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-400">Tüm kartlara vade farksız taksit seçenekleri</span>
                    </div>
                  </label>
                )}

                {/* 3. Kapıda Nakit Ödeme */}
                {isCashOnDeliveryActive && (
                  <label className={`flex items-start space-x-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-amber-400 bg-neutral-950 shadow-md shadow-amber-500/10'
                      : 'border-neutral-800 bg-neutral-950/60 hover:bg-neutral-950'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={paymentMethod === 'cash_on_delivery'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-0.5 accent-amber-500"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-white block mb-0.5">Kapıda Nakit Ödeme</span>
                      <span className="text-[11px] text-neutral-400">Ürünü teslim alırken nakit ödeyin</span>
                    </div>
                  </label>
                )}

                {/* 4. Kapıda Kredi Kartı */}
                {isCardOnDeliveryActive && (
                  <label className={`flex items-start space-x-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cc_on_delivery'
                      ? 'border-amber-400 bg-neutral-950 shadow-md shadow-amber-500/10'
                      : 'border-neutral-800 bg-neutral-950/60 hover:bg-neutral-950'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cc_on_delivery"
                      checked={paymentMethod === 'cc_on_delivery'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-0.5 accent-amber-500"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-white block mb-0.5">Kapıda Kredi Kartı</span>
                      <span className="text-[11px] text-neutral-400">Kuryenin mobil POS cihazıyla temassız çekim</span>
                    </div>
                  </label>
                )}

                {/* 5. Banka Havalesi / EFT */}
                {isBankTransferActive && (
                  <label className={`flex items-start space-x-3 p-4 rounded-2xl border cursor-pointer transition-all sm:col-span-2 ${
                    paymentMethod === 'transfer'
                      ? 'border-amber-400 bg-neutral-950 shadow-md shadow-amber-500/10'
                      : 'border-neutral-800 bg-neutral-950/60 hover:bg-neutral-950'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      checked={paymentMethod === 'transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-0.5 accent-amber-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white block mb-0.5">Banka Havalesi / EFT</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          %3 İndirim Avantajı
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-400">Ziraat, İş Bankası, Garanti BBVA ve tüm Türk bankaları</span>
                    </div>
                  </label>
                )}

              </div>

              {/* ----------------- SUB-VIEW: İyzico Credit Card Form ----------------- */}
              {paymentMethod === "iyzico" && (
                <div className="bg-neutral-950 p-5 rounded-2xl border border-blue-900/40 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
                    <div className="flex items-center space-x-2 text-xs font-bold text-white">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                      <span>İyzico Korumalı Kredi / Banka Kartı Ödemesi</span>
                      {paymentSettings?.iyzico?.testMode && (
                        <span className="text-[10px] font-normal text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          (Sandbox Test Modu)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1.5 text-[10px] font-bold text-neutral-400">
                      <span>VISA</span> • <span>MASTERCARD</span> • <span>TROY</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-neutral-400 font-semibold mb-1">Kart Üzerindeki İsim</label>
                      <input
                        type="text"
                        required={paymentMethod === "iyzico"}
                        value={cardData.name}
                        onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                        placeholder="ÖRN: MEHMET YILMAZ"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white uppercase focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-neutral-400 font-semibold mb-1 flex items-center justify-between">
                        <span>Kart Numarası</span>
                        {getCardBrand() && (
                          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                            {getCardBrand()}
                          </span>
                        )}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required={paymentMethod === "iyzico"}
                          value={cardData.number}
                          onChange={handleCardNumberChange}
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white font-mono tracking-wider focus:outline-none focus:border-blue-500 transition"
                        />
                        <CreditCard className="absolute right-3.5 top-3 h-4 w-4 text-neutral-500" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-400 font-semibold mb-1">Son Kullanma Tarihi</label>
                      <input
                        type="text"
                        required={paymentMethod === "iyzico"}
                        value={cardData.expiry}
                        onChange={handleExpiryChange}
                        placeholder="AA / YY"
                        maxLength={5}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-blue-500 transition text-center"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 font-semibold mb-1 flex items-center justify-between">
                        <span>Güvenlik Kodu (CVV)</span>
                        <span className="text-[10px] text-neutral-500">Kartın arkasındaki 3 hane</span>
                      </label>
                      <input
                        type="password"
                        required={paymentMethod === "iyzico"}
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                        placeholder="•••"
                        maxLength={3}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-blue-500 transition text-center"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-[11px] text-neutral-400 pt-1">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Ödeme butonuna tıkladığınızda bankanızın <strong>3D Secure SMS Onay</strong> ekranına yönlendirileceksiniz.</span>
                  </div>
                </div>
              )}

              {/* ----------------- SUB-VIEW: PayTR Installments & Card Form ----------------- */}
              {paymentMethod === "paytr" && (
                <div className="bg-neutral-950 p-5 rounded-2xl border border-emerald-900/40 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
                    <div className="flex items-center space-x-2 text-xs font-bold text-white">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>PayTR Sanal POS Taksit ve Kart Bilgileri</span>
                      {paymentSettings?.paytr?.testMode && (
                        <span className="text-[10px] font-normal text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          (Test Modu)
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold">Taksit İmkanı</span>
                  </div>

                  {/* Installments Table */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-neutral-300">Taksit Seçimi:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedInstallment(1)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                          selectedInstallment === 1
                            ? 'bg-emerald-950/40 border-emerald-400 text-white font-bold'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                        }`}
                      >
                        <span className="block text-[11px] text-neutral-400">Tek Çekim</span>
                        <span className="text-emerald-400 font-bold">{totalAmount.toLocaleString("tr-TR")} ₺</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedInstallment(3)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                          selectedInstallment === 3
                            ? 'bg-emerald-950/40 border-emerald-400 text-white font-bold'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                        }`}
                      >
                        <span className="block text-[11px] text-neutral-400">3 Taksit</span>
                        <span className="text-emerald-400 font-bold">3 x {Math.round(totalAmount / 3).toLocaleString("tr-TR")} ₺</span>
                      </button>

                      {(paymentSettings?.paytr?.maxInstallments || 6) >= 6 && (
                        <button
                          type="button"
                          onClick={() => setSelectedInstallment(6)}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                            selectedInstallment === 6
                              ? 'bg-emerald-950/40 border-emerald-400 text-white font-bold'
                              : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                          }`}
                        >
                          <span className="block text-[11px] text-neutral-400">6 Taksit</span>
                          <span className="text-emerald-400 font-bold">6 x {Math.round(totalAmount / 6).toLocaleString("tr-TR")} ₺</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                    <div className="sm:col-span-2">
                      <label className="block text-neutral-400 font-semibold mb-1">Kart Numarası</label>
                      <input
                        type="text"
                        required={paymentMethod === "paytr"}
                        value={cardData.number}
                        onChange={handleCardNumberChange}
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white font-mono tracking-wider focus:outline-none focus:border-emerald-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 font-semibold mb-1">Son Kullanma (AA/YY)</label>
                      <input
                        type="text"
                        required={paymentMethod === "paytr"}
                        value={cardData.expiry}
                        onChange={handleExpiryChange}
                        placeholder="AA / YY"
                        maxLength={5}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500 transition text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 font-semibold mb-1">CVV / Güvenlik Kodu</label>
                      <input
                        type="password"
                        required={paymentMethod === "paytr"}
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                        placeholder="•••"
                        maxLength={3}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500 transition text-center"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------- SUB-VIEW: Bank Transfer (Havale/EFT) Accounts ----------------- */}
              {paymentMethod === "transfer" && (
                <div className="bg-neutral-950 p-5 rounded-2xl border border-amber-500/30 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
                    <div className="flex items-center space-x-2 text-xs font-bold text-white">
                      <Building2 className="h-4 w-4 text-amber-400" />
                      <span>Havale / EFT Yapılacak Bankayı Seçin</span>
                    </div>
                    <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      Hızlı Onay
                    </span>
                  </div>

                  {/* Bank List Pills */}
                  {paymentSettings?.bankTransfer?.accounts && paymentSettings.bankTransfer.accounts.length > 0 ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {paymentSettings.bankTransfer.accounts.map((acc) => (
                          <button
                            key={acc.id}
                            type="button"
                            onClick={() => setSelectedBankId(acc.id)}
                            className={`p-3 rounded-xl border text-left text-xs transition-all ${
                              selectedBankId === acc.id
                                ? 'bg-amber-500/10 border-amber-400 text-white font-bold shadow-md shadow-amber-500/10'
                                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                            }`}
                          >
                            <span className="block font-bold text-white truncate">{acc.bankName}</span>
                            <span className="text-[10px] text-neutral-400 truncate block">{acc.branch || "Merkez Şube"}</span>
                          </button>
                        ))}
                      </div>

                      {/* Selected Bank Details Card */}
                      {activeBank && (
                        <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 space-y-3 mt-3">
                          <div className="flex justify-between items-center text-xs">
                            <div>
                              <span className="text-[11px] text-neutral-400 block">Hesap Sahibi:</span>
                              <span className="font-bold text-white">{activeBank.accountHolder}</span>
                            </div>
                            <span className="px-2 py-1 rounded bg-neutral-950 text-amber-400 font-bold text-[11px] border border-neutral-800">
                              {activeBank.bankName}
                            </span>
                          </div>

                          <div>
                            <span className="text-[11px] text-neutral-400 block mb-1">IBAN Numarası:</span>
                            <div className="flex items-center justify-between bg-neutral-950 px-3.5 py-2.5 rounded-xl border border-neutral-800 font-mono text-xs sm:text-sm text-amber-300">
                              <span className="select-all tracking-wider">{activeBank.iban}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyIban(activeBank.iban)}
                                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition text-[11px] ml-2 shrink-0 font-sans"
                              >
                                {copiedIban === activeBank.iban ? (
                                  <>
                                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                                    <span className="text-emerald-400 font-bold">Kopyalandı</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3.5 w-3.5" />
                                    <span>Kopyala</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Instructions */}
                      <p className="text-[11px] text-neutral-400 leading-relaxed bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/60 flex items-start gap-2">
                        <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{paymentSettings.bankTransfer.instructions || "Lütfen havale/EFT açıklama kısmına Ad-Soyad veya Sipariş Numaranızı yazınız. Siparişiniz havale teyidinden hemen sonra kargoya verilecektir."}</span>
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-xs text-neutral-400">
                      Banka hesapları sistem yöneticisi tarafından yapılandırılıyor.
                    </div>
                  )}
                </div>
              )}

              {/* ----------------- SUB-VIEW: Kapıda Nakit / Kart Bilgi ----------------- */}
              {paymentMethod === "cash_on_delivery" && (
                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 text-xs text-neutral-300 space-y-1">
                  <div className="flex items-center space-x-2 text-white font-bold">
                    <Banknote className="h-4 w-4 text-amber-400" />
                    <span>Kapıda Nakit Ödeme Hakkında</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Sipariş tutarınızı kargo teslimat görevlisine paketinizi teslim alırken nakit olarak ödeyebilirsiniz. Lütfen tam tutarı hazır bulundurunuz.
                  </p>
                </div>
              )}

              {paymentMethod === "cc_on_delivery" && (
                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 text-xs text-neutral-300 space-y-1">
                  <div className="flex items-center space-x-2 text-white font-bold">
                    <CreditCard className="h-4 w-4 text-amber-400" />
                    <span>Kapıda Kredi Kartı Hakkında</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Kargo personeli yanındaki mobil POS cihazı ile kapınızda temassız veya çipli olarak ödemenizi alacaktır.
                  </p>
                </div>
              )}

            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-2xl sticky top-28">
              <h3 className="text-base font-bold text-white mb-4 pb-3 border-b border-neutral-800">
                Sipariş Detayı
              </h3>

              {/* Cart Items List */}
              <div className="space-y-3 mb-6 max-h-72 overflow-y-auto pr-1">
                {items.length === 0 ? (
                  <div className="text-center py-6 text-neutral-400 text-xs">
                    <p>Sepetinizde henüz ürün bulunmuyor.</p>
                    <Link href="/products" className="text-amber-400 font-bold underline mt-1 inline-block">
                      Ürünleri İncele
                    </Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 bg-neutral-950/60 p-2.5 rounded-2xl border border-neutral-800">
                      <div className="h-14 w-14 rounded-xl overflow-hidden bg-neutral-950 shrink-0 border border-neutral-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                        <p className="text-[11px] text-amber-400 font-medium">{item.kg} KG Paket {item.gift ? `• +${item.gift} KG Hediye` : ""} • {item.quantity} Adet</p>
                        <p className="text-[11px] font-bold text-white">{item.totalPrice.toLocaleString("tr-TR")} ₺</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-900 transition-colors"
                        title="Sepetten Çıkar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2.5 text-xs mb-6">
                <div className="flex justify-between text-neutral-400">
                  <span>Ürün Ara Toplamı:</span>
                  <span className="text-neutral-200">{totalAmount.toLocaleString("tr-TR")} ₺</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Toplu Alım İndirimi (5 KG):</span>
                  <span className="text-emerald-400 font-semibold">-250 ₺ (Dahil)</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Soğuk Zincir Özel Kargo:</span>
                  <span className="text-emerald-400 font-bold">ÜCRETSİZ</span>
                </div>
                <div className="pt-3 border-t border-neutral-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Genel Toplam:</span>
                  <span className="text-2xl font-black text-amber-400">{totalAmount.toLocaleString("tr-TR")} ₺</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={items.length === 0}
                className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm tracking-wide shadow-xl shadow-red-900/40 hover:scale-[1.02] active:scale-98 transition-all mb-4"
              >
                {paymentMethod === "iyzico" && "İyzico 3D Secure İle Öde"}
                {paymentMethod === "paytr" && `PayTR İle Öde (${selectedInstallment === 1 ? 'Tek Çekim' : `${selectedInstallment} Taksit`})`}
                {paymentMethod === "cash_on_delivery" && "Kapıda Nakit Ödeme İle Tamamla"}
                {paymentMethod === "cc_on_delivery" && "Kapıda Kredi Kartı İle Tamamla"}
                {paymentMethod === "transfer" && "Havale / EFT İle Siparişi Onayla"}
              </button>

              <div className="flex items-center justify-center space-x-2 text-[11px] text-neutral-500">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>256-Bit SSL Şifreli Güvenli Sipariş</span>
              </div>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}

