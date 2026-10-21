"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Image as ImageIcon, Save, X, Check, ArrowLeft, Loader2 } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

interface AdminProduct {
  id: number;
  name: string;
  category: string;
  pricePerKg: number;
  stockKg: number;
  isActive: boolean;
  imageUrl: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Kangal Sucuk");
  const [pricePerKg, setPricePerKg] = useState(590);
  const [stockKg, setStockKg] = useState(100);
  const [imageUrl, setImageUrl] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Ürünler yüklenirken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName("");
    setCategory("Kangal Sucuk");
    setPricePerKg(590);
    setStockKg(100);
    setImageUrl("/uploads/1790690304656_sucuk_duzenleme_07_UHD.jpg");
    setModalOpen(true);
  };

  const handleOpenEdit = (p: AdminProduct) => {
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category || "Kangal Sucuk");
    setPricePerKg(p.pricePerKg);
    setStockKg(p.stockKg);
    setImageUrl(p.imageUrl);
    setModalOpen(true);
  };

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (editingProduct) {
        // Update product via API
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            category,
            pricePerKg,
            stockKg,
            imageUrl: imageUrl || editingProduct.imageUrl
          })
        });
        const data = await res.json();
        if (res.ok && data.product) {
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? data.product : p));
          showNotification("✓ Ürün ve görsel başarıyla kaydedildi!");
        } else {
          alert(data.error || "Kaydedilemedi.");
        }
      } else {
        // Create new product via API
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            category,
            pricePerKg,
            stockKg,
            imageUrl: imageUrl || "/uploads/1790690304656_sucuk_duzenleme_07_UHD.jpg"
          })
        });
        const data = await res.json();
        if (res.ok && data.product) {
          setProducts(prev => [data.product, ...prev]);
          showNotification("✓ Yeni sucuk ürünü başarıyla eklendi ve kaydedildi!");
        } else {
          alert(data.error || "Ürün eklenemedi.");
        }
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Bağlantı hatası oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
        if (res.ok) {
          setProducts(prev => prev.filter(p => p.id !== id));
          showNotification("✓ Ürün başarıyla silindi.");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Ürün Yönetimi</h1>
          <p className="text-xs text-neutral-400 mt-1">Sucuk çeşitleri, kilogram fiyatları ve stok durumunu yönetin.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-900/30 transition-all hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          <span>Yeni Sucuk Ürünü Ekle</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {toastMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Product Table */}
      <div className="bg-neutral-900/90 rounded-3xl shadow-xl border border-neutral-800 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-neutral-400 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
            <span className="text-xs">Ürünler yükleniyor...</span>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider font-bold text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Görsel</th>
                <th className="py-3.5 px-4">Ürün Adı</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Kg Fiyatı</th>
                <th className="py-3.5 px-4">Stok (KG)</th>
                <th className="py-3.5 px-4">Durum</th>
                <th className="py-3.5 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="h-12 w-12 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-white">{p.name}</td>
                  <td className="py-3 px-4 text-neutral-400">{p.category}</td>
                  <td className="py-3 px-4 font-bold text-red-500 text-sm">{p.pricePerKg} ₺</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-neutral-200">{p.stockKg} KG</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Satışta
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-2 rounded-xl bg-neutral-800 hover:bg-amber-500/20 text-neutral-400 hover:text-amber-400 border border-neutral-700 transition-colors"
                        title="Düzenle"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 rounded-xl bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 border border-neutral-700 transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Edit / Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-neutral-100">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-800 mb-5">
              <h3 className="font-black text-white text-base">
                {editingProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-300 mb-1">Ürün Adı</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-red-600"
                  placeholder="Örn: Özel Kangal Sucuk"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-300 mb-1">Kilogram Fiyatı (₺)</label>
                  <input
                    type="number"
                    required
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-300 mb-1">Stok Miktarı (KG)</label>
                  <input
                    type="number"
                    required
                    value={stockKg}
                    onChange={(e) => setStockKg(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* Image Uploader */}
              <ImageUploader
                label="Ürün Görseli"
                helperText="Ürünün fotoğrafını seçin veya sürükleyin (PNG, JPG, WEBP)"
                currentImageUrl={imageUrl}
                onImageUploaded={(url) => setImageUrl(url)}
                aspectRatio="square"
              />

              <div className="pt-3 border-t border-neutral-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-700 text-neutral-400 hover:bg-neutral-800 font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold flex items-center gap-1.5 shadow-md"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Kaydediliyor...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Kaydet</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
