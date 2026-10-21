"use client";

import { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  Search, 
  Filter, 
  Printer, 
  FileText, 
  Package, 
  ArrowUpDown, 
  Loader2, 
  Check,
  ChevronDown
} from "lucide-react";
import { StoredOrder } from "@/lib/dataStore";
import OrderPrintModal from "@/components/admin/OrderPrintModal";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Printing state
  const [selectedOrder, setSelectedOrder] = useState<StoredOrder | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [printTab, setPrintTab] = useState<"invoice" | "shipping">("invoice");
  const [printMenuOpenId, setPrintMenuOpenId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Siparişler getirilemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: string, newStatus: StoredOrder["status"]) => {
    // Optimistic UI update
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));

    try {
      await fetch(`/api/orders/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error("Durum güncellenemedi:", err);
    }
  };

  const handleOpenPrint = (order: StoredOrder, tab: "invoice" | "shipping") => {
    setSelectedOrder(order);
    setPrintTab(tab);
    setPrintModalOpen(true);
    setPrintMenuOpenId(null);
  };

  // Filter logic
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search) ||
      o.city.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== "İptal" ? o.total : 0), 0);
  const pendingCount = orders.filter(o => o.status === "Hazırlanıyor").length;
  const shippedCount = orders.filter(o => o.status === "Kargolandı").length;

  return (
    <div>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Sipariş & Kargo Yönetimi</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Gelen siparişleri yönetin, durumlarını güncelleyin ve tek tıkla kargo/sipariş fişlerini yazdırın.
          </p>
        </div>

        {/* Quick batch info badge */}
        <div className="flex items-center space-x-2 bg-neutral-900 border border-neutral-800 px-3.5 py-2 rounded-2xl">
          <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs font-bold text-neutral-300">
            Bekleyen Kargolar: <strong className="text-amber-400">{pendingCount} Adet</strong>
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-neutral-900/90 border border-neutral-800 p-4 rounded-2xl">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Toplam Sipariş</p>
          <p className="text-2xl font-black text-white mt-1">{orders.length}</p>
        </div>
        <div className="bg-neutral-900/90 border border-neutral-800 p-4 rounded-2xl">
          <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Hazırlanan (Bekleyen)</p>
          <p className="text-2xl font-black text-amber-400 mt-1">{pendingCount}</p>
        </div>
        <div className="bg-neutral-900/90 border border-neutral-800 p-4 rounded-2xl">
          <p className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Kargoda</p>
          <p className="text-2xl font-black text-blue-400 mt-1">{shippedCount}</p>
        </div>
        <div className="bg-neutral-900/90 border border-neutral-800 p-4 rounded-2xl">
          <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Toplam Ciro</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{totalRevenue.toLocaleString("tr-TR")} ₺</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-neutral-900/90 p-4 rounded-2xl border border-neutral-800 mb-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Sipariş no, müşteri adı veya telefon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-neutral-400 hidden sm:inline">Durum:</span>
          <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto">
            {[
              { id: "all", label: "Tümü" },
              { id: "Hazırlanıyor", label: "Hazırlanıyor" },
              { id: "Kargolandı", label: "Kargolandı" },
              { id: "Teslim Edildi", label: "Teslim Edildi" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  statusFilter === f.id
                    ? "bg-amber-500 text-neutral-950 shadow-md font-black"
                    : "bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-neutral-900/90 rounded-3xl shadow-xl border border-neutral-800 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-neutral-400 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
            <span className="text-xs">Siparişler yükleniyor...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center text-neutral-500 text-xs">
            Aradığınız kritere uygun sipariş bulunamadı.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider font-bold text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Sipariş No</th>
                  <th className="py-3.5 px-4">Müşteri</th>
                  <th className="py-3.5 px-4">Şehir / İlçe</th>
                  <th className="py-3.5 px-4">Ürün & KG</th>
                  <th className="py-3.5 px-4">Toplam Tutar</th>
                  <th className="py-3.5 px-4">Ödeme Yöntemi</th>
                  <th className="py-3.5 px-4">Durum</th>
                  <th className="py-3.5 px-4 text-center">Yazdır (Belge)</th>
                  <th className="py-3.5 px-4 text-right">Durum Değiştir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      <span className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800">
                        {o.id}
                      </span>
                      <span className="block text-[10px] text-neutral-500 mt-1 font-sans">{o.date}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{o.customerName}</p>
                      <p className="text-[11px] text-neutral-400">{o.phone}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-neutral-200 font-medium">{o.city}</span>
                      <span className="block text-[10px] text-neutral-400">{o.district}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-neutral-200 block truncate max-w-xs">{o.items}</span>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 font-bold text-amber-400">
                        {o.kg} KG
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-white text-sm">
                      {o.total.toLocaleString("tr-TR")} ₺
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        o.paymentMethod.includes("Kapıda")
                          ? "bg-red-950/60 text-red-300 border border-red-800/50"
                          : "bg-emerald-950/60 text-emerald-300 border border-emerald-800/50"
                      }`}>
                        {o.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        o.status === 'Hazırlanıyor' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        o.status === 'Kargolandı' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        o.status === 'Teslim Edildi' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {o.status}
                      </span>
                    </td>

                    {/* Modern Print Dropdown / Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="relative inline-block text-left">
                        <div className="flex items-center justify-center space-x-1.5">
                          {/* Quick button 1: Sipariş Fişi */}
                          <button
                            onClick={() => handleOpenPrint(o, "invoice")}
                            title="Sipariş Bilgi Fişi Yazdır"
                            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 text-[11px] font-bold transition shadow-sm"
                          >
                            <FileText className="h-3.5 w-3.5 text-amber-400" />
                            <span>Fiş</span>
                          </button>

                          {/* Quick button 2: Kargo Etiketi */}
                          <button
                            onClick={() => handleOpenPrint(o, "shipping")}
                            title="Kargo Gönderim Etiketi Yazdır"
                            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-[11px] font-bold transition shadow-sm"
                          >
                            <Truck className="h-3.5 w-3.5" />
                            <span>Kargo</span>
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Status Select */}
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value as StoredOrder["status"])}
                        className="border border-neutral-700 rounded-xl px-2.5 py-1.5 text-xs bg-neutral-950 text-neutral-200 focus:outline-none focus:border-red-600 cursor-pointer"
                      >
                        <option value="Hazırlanıyor">Hazırlanıyor</option>
                        <option value="Kargolandı">Kargolandı</option>
                        <option value="Teslim Edildi">Teslim Edildi</option>
                        <option value="İptal">İptal</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modern Print Modal */}
      <OrderPrintModal
        order={selectedOrder}
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        defaultTab={printTab}
      />
    </div>
  );
}
