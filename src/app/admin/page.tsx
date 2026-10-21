"use client";

import Link from "next/link";
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Users, 
  ArrowUpRight, 
  Plus, 
  Sliders, 
  Clock, 
  CheckCircle2, 
  Truck,
  Sparkles
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-neutral-950 via-neutral-900 to-red-950/40 p-6 rounded-3xl border border-neutral-800 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold mb-2">
            <Sparkles className="h-3 w-3" />
            <span>Afyon Fabrika Satış Portalı</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Hoş Geldiniz, <span className="gold-gradient-text">Ardabey Yönetim</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Bugün mağazanızda 4 yeni sipariş oluşturuldu. Sipariş hazırlama durumlarını inceleyebilirsiniz.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Link
            href="/admin/products"
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-900/30 transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            <span>Ürün Ekle</span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold text-xs border border-neutral-800 transition-all"
          >
            <Sliders className="h-4 w-4" />
            <span>Site Ayarları</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1 */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 shadow-lg relative overflow-hidden group hover:border-amber-500/30 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Aylık Ciro</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">184.650 ₺</span>
            <span className="text-xs font-bold text-emerald-400">+18%</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">Geçen aya göre artış eğiliminde</p>
        </div>

        {/* Card 2 */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 shadow-lg relative overflow-hidden group hover:border-red-500/30 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Bekleyen Siparişler</span>
            <div className="p-2 rounded-xl bg-red-600/10 text-red-500">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">4 Adet</span>
            <span className="text-xs font-bold text-amber-400">Hazırlanıyor</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">Soğuk zincir paketleme aşamasında</p>
        </div>

        {/* Card 3 */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Toplam Sucuk Satışı</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">1.480 KG</span>
            <span className="text-xs font-bold text-emerald-400">Bu Ay</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">%100 yerli dana eti sucuk</p>
        </div>

        {/* Card 4 */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 shadow-lg relative overflow-hidden group hover:border-blue-500/30 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Müşteri Memnuniyeti</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">%99.4</span>
            <span className="text-xs font-bold text-blue-400">4.9 / 5</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">Doğal lezzet ve hızlı teslimat</p>
        </div>

      </div>

      {/* Recent Orders & Quick Product Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Orders Table (8 cols) */}
        <div className="lg:col-span-8 bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-base font-bold text-white">Son Gelen Siparişler</h2>
              <p className="text-xs text-neutral-400 mt-0.5">En son sipariş verilen ürünler ve teslimat durumları</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Tümünü Gör</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-3">Sipariş No</th>
                  <th className="py-3 px-3">Müşteri</th>
                  <th className="py-3 px-3">Ürün & KG</th>
                  <th className="py-3 px-3">Tutar</th>
                  <th className="py-3 px-3">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                <tr className="hover:bg-neutral-800/40 transition">
                  <td className="py-3.5 px-3 font-mono font-bold text-white">#ORD-9841</td>
                  <td className="py-3.5 px-3">
                    <p className="font-semibold text-white">Ahmet Yılmaz</p>
                    <p className="text-[11px] text-neutral-500">İstanbul / Kadıköy</p>
                  </td>
                  <td className="py-3.5 px-3">
                    <span>Özel Afyon Kangal Sucuk</span>
                    <span className="ml-1.5 px-1.5 py-0.5 rounded bg-neutral-800 font-bold text-amber-400">5 KG</span>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-white">2.700 ₺</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Hazırlanıyor
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-neutral-800/40 transition">
                  <td className="py-3.5 px-3 font-mono font-bold text-white">#ORD-9840</td>
                  <td className="py-3.5 px-3">
                    <p className="font-semibold text-white">Selin Demir</p>
                    <p className="text-[11px] text-neutral-500">Ankara / Çankaya</p>
                  </td>
                  <td className="py-3.5 px-3">
                    <span>Gurme Acılı Parmak</span>
                    <span className="ml-1.5 px-1.5 py-0.5 rounded bg-neutral-800 font-bold text-amber-400">3 KG</span>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-white">1.860 ₺</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Kargolandı
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-neutral-800/40 transition">
                  <td className="py-3.5 px-3 font-mono font-bold text-white">#ORD-9839</td>
                  <td className="py-3.5 px-3">
                    <p className="font-semibold text-white">Mehmet Çelik</p>
                    <p className="text-[11px] text-neutral-500">İzmir / Karşıyaka</p>
                  </td>
                  <td className="py-3.5 px-3">
                    <span>Ev Tipi Doğal Fermente</span>
                    <span className="ml-1.5 px-1.5 py-0.5 rounded bg-neutral-800 font-bold text-amber-400">10 KG</span>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-white">6.300 ₺</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Teslim Edildi
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products & Stock (4 cols) */}
        <div className="lg:col-span-4 bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white mb-1">En Çok Satan Sucuklar</h2>
            <p className="text-xs text-neutral-400 mb-6">Mevcut stok ve satış oranları</p>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-white">Özel Afyon Kangal</span>
                  <span className="text-amber-400 font-semibold">450 KG Stok</span>
                </div>
                <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 rounded-full w-[78%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-white">Gurme Acılı Parmak</span>
                  <span className="text-amber-400 font-semibold">280 KG Stok</span>
                </div>
                <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[54%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-white">Doğal Ev Tipi Fermente</span>
                  <span className="text-amber-400 font-semibold">190 KG Stok</span>
                </div>
                <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[42%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-white">Dilimli Pratik Kangal</span>
                  <span className="text-amber-400 font-semibold">320 KG Stok</span>
                </div>
                <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-[60%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-800 mt-6">
            <Link
              href="/admin/products"
              className="block w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white text-center rounded-xl text-xs font-bold transition-all"
            >
              Stok & Fiyatları Düzenle
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
