"use client";

import { useState } from "react";
import { Printer, X, FileText, Truck, ShieldCheck, Snowflake, CheckCircle2, AlertTriangle, QrCode } from "lucide-react";
import { StoredOrder } from "@/lib/dataStore";

interface OrderPrintModalProps {
  order: StoredOrder | null;
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "invoice" | "shipping";
}

export default function OrderPrintModal({
  order,
  isOpen,
  onClose,
  defaultTab = "invoice"
}: OrderPrintModalProps) {
  const [activeTab, setActiveTab] = useState<"invoice" | "shipping">(defaultTab);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const isTahsilatli = order.paymentMethod.includes("Kapıda");

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      
      {/* Container - on print, only print-content is visible */}
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden print:border-none print:shadow-none print:bg-white print:w-full print:max-w-none print:static">
        
        {/* Modal Controls Bar (Hidden during print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-neutral-800 bg-neutral-950 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="flex h-3 w-3 rounded-full bg-red-600 animate-pulse" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Belge Yazdırma: <span className="text-amber-400 font-mono">{order.id}</span>
            </h3>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center bg-neutral-900 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setActiveTab("invoice")}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "invoice"
                  ? "bg-amber-500 text-neutral-950 shadow-md font-black"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Sipariş Bilgi Fişi</span>
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "shipping"
                  ? "bg-amber-500 text-neutral-950 shadow-md font-black"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Truck className="h-3.5 w-3.5" />
              <span>Kargo Sevk Etiketi</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-900/40 transition-all hover:scale-105 active:scale-95"
            >
              <Printer className="h-4 w-4" />
              <span>Yazdır / Çıktı Al</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 transition"
              aria-label="Kapat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div className="p-6 sm:p-8 bg-neutral-900/60 max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0 print:bg-white">
          
          {/* TAB 1: SİPARİŞ BİLGİ & SEVK FİŞİ */}
          {activeTab === "invoice" && (
            <div className="bg-white text-neutral-900 p-8 sm:p-10 rounded-2xl shadow-xl print:shadow-none print:p-6 print:rounded-none max-w-3xl mx-auto border border-neutral-300 font-sans">
              
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-neutral-900 pb-5 mb-6">
                <div className="flex items-center space-x-3.5">
                  <div className="h-16 w-16 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/uploads/1790692225772_Since_1978.png" alt="Ardabey Sucukları" className="h-full w-full object-contain" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950">ARDABEY</span>
                      <span className="text-2xl sm:text-3xl font-light tracking-tight text-amber-700">SUCUKLARI</span>
                    </div>
                    <p className="text-[11px] font-bold tracking-widest text-neutral-700 uppercase mt-0.5">
                      Geleneksel Afyonkarahisar Lezzeti • 1978
                    </p>
                    <p className="text-[10px] text-neutral-500 mt-1 max-w-sm">
                      Organize Sanayi Bölgesi 2. Cadde No: 14 Afyonkarahisar<br />
                      Müşteri Destek: 0850 308 19 23 | info@ardabeysucuklari.com
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-neutral-950 text-white font-mono font-black text-sm rounded-lg">
                    {order.id}
                  </span>
                  <p className="text-[11px] font-bold text-neutral-700 mt-1.5">
                    SİPARİŞ SEVK & BİLGİ FORMU
                  </p>
                  <p className="text-[10px] text-neutral-500 font-medium">
                    Tarih: {order.date}
                  </p>
                </div>
              </div>

              {/* Customer & Order Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <h4 className="text-[11px] font-black uppercase text-neutral-700 tracking-wider mb-2 pb-1 border-b border-neutral-200">
                    Müşteri & Teslimat Bilgileri
                  </h4>
                  <p className="text-sm font-black text-neutral-950">{order.customerName}</p>
                  <p className="text-xs font-semibold text-neutral-700 mt-0.5">{order.phone}</p>
                  {order.email && <p className="text-[11px] text-neutral-500">{order.email}</p>}
                  <p className="text-xs text-neutral-800 mt-1.5 font-medium leading-relaxed">
                    {order.address}
                  </p>
                  <p className="text-xs font-bold text-neutral-900 mt-1">
                    {order.district} / {order.city}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[11px] font-black uppercase text-neutral-700 tracking-wider mb-2 pb-1 border-b border-neutral-200">
                      Kargo & Ödeme Durumu
                    </h4>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Ödeme Yöntemi:</span>
                        <span className="font-bold text-neutral-950">{order.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Kargo Firması:</span>
                        <span className="font-semibold text-neutral-800">{order.cargoCompany}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Kargo Takip No:</span>
                        <span className="font-mono font-bold text-neutral-950">{order.trackingNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Sipariş Durumu:</span>
                        <span className="font-bold text-amber-700">{order.status}</span>
                      </div>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="mt-2 pt-2 border-t border-neutral-200 text-[10px] text-neutral-600 italic">
                      <strong>Müşteri Notu:</strong> {order.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Products Table */}
              <div className="mb-6 overflow-hidden rounded-xl border border-neutral-300">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-100 border-b border-neutral-300 text-neutral-700 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Ürün Açıklaması</th>
                      <th className="py-2.5 px-3 text-center">Miktar</th>
                      <th className="py-2.5 px-3 text-right">Birim (Kg)</th>
                      <th className="py-2.5 px-3 text-right">Tutar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 text-neutral-800">
                    {order.itemsList && order.itemsList.length > 0 ? (
                      order.itemsList.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2.5 px-3 text-neutral-500 font-mono">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-bold text-neutral-900">
                            {item.name}
                            <span className="block text-[10px] font-normal text-neutral-500">
                              %100 Afyon Sucuğu • Isıl İşlemsiz Doğal Fermente
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold">{item.kg} KG</td>
                          <td className="py-2.5 px-3 text-right">{item.pricePerKg} ₺</td>
                          <td className="py-2.5 px-3 text-right font-black text-neutral-950">
                            {item.totalPrice.toLocaleString("tr-TR")} ₺
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-2.5 px-3 text-neutral-500 font-mono">1</td>
                        <td className="py-2.5 px-3 font-bold text-neutral-900">
                          {order.items}
                          <span className="block text-[10px] font-normal text-neutral-500">
                            Geleneksel Tescilli Afyon Sucuğu
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold">{order.kg} KG</td>
                        <td className="py-2.5 px-3 text-right">
                          {Math.round(order.total / order.kg)} ₺
                        </td>
                        <td className="py-2.5 px-3 text-right font-black text-neutral-950">
                          {order.total.toLocaleString("tr-TR")} ₺
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Total Summary Breakdown */}
              <div className="flex justify-between items-start mb-6">
                <div className="max-w-xs space-y-2">
                  <div className="flex items-center space-x-2 text-[11px] font-bold text-neutral-700 bg-neutral-100 p-2.5 rounded-lg border border-neutral-200">
                    <Snowflake className="h-4 w-4 text-cyan-600 shrink-0" />
                    <span>Özel Soğuk Zincir Strafor Kutu & Buz Aküsü İle Gönderilmiştir.</span>
                  </div>
                  <p className="text-[10px] text-neutral-500 leading-tight">
                    * 213 Sayılı V.U.K. hükümlerine istinaden sevk irsaliyesi yerine geçen bilgi fişidir.
                  </p>
                </div>

                <div className="w-64 space-y-1.5 text-xs text-neutral-700">
                  <div className="flex justify-between">
                    <span>Ara Toplam:</span>
                    <span className="font-semibold">{order.total.toLocaleString("tr-TR")} ₺</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Soğuk Zincir Kargo:</span>
                    <span>ÜCRETSİZ</span>
                  </div>
                  <div className="pt-2 border-t-2 border-neutral-900 flex justify-between items-baseline">
                    <span className="text-sm font-black text-neutral-950">GENEL TOPLAM:</span>
                    <span className="text-xl font-black text-red-700">{order.total.toLocaleString("tr-TR")} ₺</span>
                  </div>
                  {isTahsilatli && (
                    <div className="p-1.5 bg-red-50 text-red-800 text-[11px] font-black text-center rounded border border-red-200">
                      KAPIDA TAHSİL EDİLECEK: {order.total.toLocaleString("tr-TR")} ₺
                    </div>
                  )}
                </div>
              </div>

              {/* Signatures & Stamps */}
              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-neutral-200 text-xs">
                <div className="text-center p-3 rounded-xl border border-dashed border-neutral-300">
                  <p className="font-bold text-neutral-700">TESLİM EDEN (FİRMA)</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Ardabey Sucukları Sevkiyat Departmanı</p>
                  <div className="h-12 flex items-center justify-center text-[10px] text-neutral-400 italic">
                    (Kaşe / Yetkili İmza)
                  </div>
                </div>

                <div className="text-center p-3 rounded-xl border border-dashed border-neutral-300">
                  <p className="font-bold text-neutral-700">TESLİM ALAN (ALICI)</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{order.customerName}</p>
                  <div className="h-12 flex items-center justify-center text-[10px] text-neutral-400 italic">
                    (İsim / Tarih / İmza)
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: KARGO GÖNDERİM & STRAFOR KOLİ ETİKETİ */}
          {activeTab === "shipping" && (
            <div className="bg-white text-neutral-900 p-6 sm:p-8 rounded-2xl shadow-xl print:shadow-none print:p-4 print:rounded-none max-w-2xl mx-auto border-2 border-neutral-900 font-sans">
              
              {/* Cold Chain High Priority Alert Banner */}
              <div className="bg-red-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Snowflake className="h-5 w-5 animate-pulse" />
                  <span className="text-xs sm:text-sm font-black tracking-wide uppercase">
                    DİKKAT: SOĞUK ZİNCİR ET ÜRÜNÜ • GECİKTİRİLEMEZ
                  </span>
                </div>
                <span className="text-[10px] bg-white text-red-700 font-black px-2 py-0.5 rounded">
                  ISI KONTROLLÜ
                </span>
              </div>

              {/* Barcode & Cargo Company Row */}
              <div className="flex justify-between items-center border-b-2 border-neutral-900 pb-4 mb-4">
                <div>
                  <h3 className="text-base font-black text-neutral-950 uppercase">
                    {order.cargoCompany}
                  </h3>
                  <p className="text-xs text-neutral-600 font-semibold">
                    Afyon Şube Çıkışlı • 24 Saat Hızlı Teslimat
                  </p>
                </div>

                <div className="text-right">
                  {/* Simulated Clean Vector Barcode */}
                  <div className="inline-block p-1 bg-white">
                    <svg className="h-10 w-44" viewBox="0 0 160 40">
                      <rect x="0" y="0" width="3" height="40" fill="#000" />
                      <rect x="5" y="0" width="2" height="40" fill="#000" />
                      <rect x="9" y="0" width="5" height="40" fill="#000" />
                      <rect x="17" y="0" width="2" height="40" fill="#000" />
                      <rect x="22" y="0" width="4" height="40" fill="#000" />
                      <rect x="28" y="0" width="2" height="40" fill="#000" />
                      <rect x="33" y="0" width="6" height="40" fill="#000" />
                      <rect x="42" y="0" width="2" height="40" fill="#000" />
                      <rect x="47" y="0" width="3" height="40" fill="#000" />
                      <rect x="53" y="0" width="5" height="40" fill="#000" />
                      <rect x="61" y="0" width="2" height="40" fill="#000" />
                      <rect x="66" y="0" width="4" height="40" fill="#000" />
                      <rect x="73" y="0" width="2" height="40" fill="#000" />
                      <rect x="78" y="0" width="5" height="40" fill="#000" />
                      <rect x="86" y="0" width="3" height="40" fill="#000" />
                      <rect x="92" y="0" width="2" height="40" fill="#000" />
                      <rect x="97" y="0" width="4" height="40" fill="#000" />
                      <rect x="104" y="0" width="6" height="40" fill="#000" />
                      <rect x="113" y="0" width="2" height="40" fill="#000" />
                      <rect x="118" y="0" width="3" height="40" fill="#000" />
                      <rect x="124" y="0" width="5" height="40" fill="#000" />
                      <rect x="132" y="0" width="2" height="40" fill="#000" />
                      <rect x="137" y="0" width="4" height="40" fill="#000" />
                      <rect x="144" y="0" width="3" height="40" fill="#000" />
                      <rect x="150" y="0" width="5" height="40" fill="#000" />
                      <rect x="158" y="0" width="2" height="40" fill="#000" />
                    </svg>
                  </div>
                  <p className="text-[11px] font-mono font-bold tracking-widest text-neutral-800">
                    {order.trackingNumber}
                  </p>
                </div>
              </div>

              {/* Large Bold Recipient Information (Alıcı) */}
              <div className="border-2 border-neutral-900 rounded-xl p-4 mb-4 bg-neutral-50/80">
                <span className="inline-block px-2.5 py-0.5 bg-neutral-900 text-white text-[10px] font-black uppercase rounded mb-2">
                  ALICI (TESLİMAT ADRESİ)
                </span>
                
                <h2 className="text-xl sm:text-2xl font-black text-neutral-950 uppercase tracking-tight">
                  {order.customerName}
                </h2>
                
                <p className="text-sm font-bold text-neutral-900 mt-1 flex items-center gap-2">
                  <span>Tel: {order.phone}</span>
                </p>

                <div className="mt-2.5 p-2.5 bg-white border border-neutral-300 rounded-lg">
                  <p className="text-xs sm:text-sm font-semibold text-neutral-800 leading-snug">
                    {order.address}
                  </p>
                </div>

                <div className="mt-2.5 flex justify-between items-center pt-2 border-t border-neutral-300">
                  <span className="text-xs font-bold text-neutral-500 uppercase">Varış İli / İlçesi:</span>
                  <span className="text-base sm:text-lg font-black text-neutral-950 uppercase">
                    {order.district} / {order.city}
                  </span>
                </div>
              </div>

              {/* Payment Box (Crucial for Courier) */}
              <div className={`p-4 rounded-xl border-2 mb-4 text-center ${
                isTahsilatli 
                  ? "border-red-600 bg-red-50 text-red-900" 
                  : "border-emerald-600 bg-emerald-50 text-emerald-950"
              }`}>
                {isTahsilatli ? (
                  <div>
                    <div className="flex items-center justify-center space-x-1.5 font-black text-xs sm:text-sm text-red-700 uppercase mb-1">
                      <AlertTriangle className="h-4 w-4" />
                      <span>TAHSİLATLI GÖNDERİ ({order.paymentMethod.toUpperCase()})</span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-red-700">
                      TAHSİL EDİLECEK: {order.total.toLocaleString("tr-TR")} ₺
                    </p>
                    <p className="text-[11px] text-red-600 font-semibold mt-0.5">
                      Kurye teslim anında bu tutarı nakit/pos ile tahsil etmelidir.
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-center space-x-1.5 font-black text-xs sm:text-sm text-emerald-800 uppercase mb-0.5">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>PEŞİN ÖDENDİ (ÜCRET TAHSİL EDİLMEYECEKTİR)</span>
                    </div>
                    <p className="text-sm font-bold text-emerald-700">
                      Ödeme Türü: {order.paymentMethod} • Tutar: {order.total.toLocaleString("tr-TR")} ₺
                    </p>
                  </div>
                )}
              </div>

              {/* Sender & Package Summary */}
              <div className="grid grid-cols-2 gap-3 text-[11px] text-neutral-700 pt-3 border-t-2 border-neutral-900">
                <div>
                  <p className="font-black text-neutral-950 uppercase text-[10px]">GÖNDERİCİ:</p>
                  <p className="font-bold text-neutral-900">Ardabey Sucukları Gıda Ltd. Şti.</p>
                  <p className="text-[10px] text-neutral-600">Afyonkarahisar OSB 2. Cd. No: 14</p>
                  <p className="text-[10px] text-neutral-600">Tel: 0850 308 19 23</p>
                </div>

                <div className="text-right">
                  <p className="font-black text-neutral-950 uppercase text-[10px]">PAKET DETAYI:</p>
                  <p className="font-bold text-neutral-900">{order.items}</p>
                  <p className="text-[10px] text-neutral-600">Ağırlık: {order.kg} KG Net ({order.kg + 0.5} KG Brüt)</p>
                  <p className="font-mono text-[10px] text-neutral-500">Ref: {order.id}</p>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
