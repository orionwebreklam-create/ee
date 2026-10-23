import fs from "fs";
import path from "path";
import { supabase, isSupabaseConfigured } from "./supabase";

export interface ProductPackage {
  kg: number;
  price: number;
  gift?: number;
}

export interface StoredProduct {
  id: number;
  name: string;
  category: string;
  tag: string;
  tagColor?: string;
  description: string;
  pricePerKg: number;
  stockKg: number;
  isActive: boolean;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  features?: string[];
  specs?: { label: string; value: string }[];
  packages?: ProductPackage[];
  variants?: string[];
}

export interface StoredSettings {
  siteName: string;
  supportPhone: string;
  whatsappPhone: string;
  logoUrl: string;
  banner1: string;
  banner2: string;
  freeShippingKg: number;
  bulkDiscountKg: number;
}

export interface OrderItemDetail {
  name: string;
  kg: number;
  quantity: number;
  pricePerKg: number;
  totalPrice: number;
}

export interface StoredOrder {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  district: string;
  items: string;
  itemsList?: OrderItemDetail[];
  kg: number;
  total: number;
  paymentMethod: string;
  status: "Hazırlanıyor" | "Kargolandı" | "Teslim Edildi" | "İptal";
  trackingNumber: string;
  cargoCompany: string;
  date: string;
  notes?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountHolder: string;
  iban: string;
  branch?: string;
}

export interface StoredPaymentSettings {
  iyzico: {
    enabled: boolean;
    testMode: boolean;
    apiKey: string;
    secretKey: string;
    baseUrl: string;
  };
  paytr: {
    enabled: boolean;
    testMode: boolean;
    merchantId: string;
    merchantKey: string;
    merchantSalt: string;
    maxInstallments: number;
  };
  cashOnDelivery: {
    enabled: boolean;
    extraFee: number;
  };
  cardOnDelivery: {
    enabled: boolean;
    extraFee: number;
  };
  bankTransfer: {
    enabled: boolean;
    accounts: BankAccount[];
    instructions: string;
  };
}

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const PAYMENTS_FILE = path.join(DATA_DIR, "payments.json");

// Ensure directory exists for local fallback
function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (e) {
    // In Vercel serverless environment, local writing might be disabled
  }
}

// Persist JSON to disk. Throws a clear error when writing is not possible
// (e.g. Vercel read-only filesystem) so the admin UI can surface it instead
// of silently showing a false "saved" success message.
function persistJson(filePath: string, data: unknown) {
  try {
    ensureDataDir();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error(`[dataStore] ${filePath} yazılamadı:`, e);
    throw new Error(
      "Değişiklikler kalıcı olarak kaydedilemedi. " +
      "Bu sunucuda kalıcı yazma izni yok (Vercel). " +
      "Kalıcı kayıt için Supabase bağlantısı gereklidir — ortam değişkenlerine " +
      "NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY ekleyin."
    );
  }
}

// -------------------------------------------------------------
// DEFAULTS
// -------------------------------------------------------------
const defaultProducts: StoredProduct[] = [
  {
    id: 1,
    name: "Afyon Sucuğu",
    category: "Afyon Sucuğu",
    tag: "En Çok Satan",
    tagColor: "bg-red-600 text-white",
    description: "Geleneksel yöntemlerle üretilmiş, taze Taşköprü sarımsağı ve yöresel Afyon baharatlarıyla yoğrulmuş, doğal bağırsakta 21 gün fermente edilmiş hakiki Afyon sucuğu.",
    pricePerKg: 350,
    stockKg: 450,
    isActive: true,
    imageUrl: "/uploads/1790690304656_sucuk_duzenleme_07_UHD.jpg",
    rating: 4.9,
    reviewsCount: 328,
    packages: [
      { kg: 1, price: 350 },
      { kg: 5, price: 1750, gift: 1 },
      { kg: 7, price: 2000, gift: 1.5 },
      { kg: 10, price: 3500, gift: 2 }
    ],
    variants: ["Acısız", "Acılı"],
    features: [
      "%100 Afyon Sucuğu",
      "Doğal Bağırsak",
      "Isıl İşlemsiz Doğal Fermente",
      "Sıfır Kimyasal Katkı & Koruyucu",
      "Glutensiz & Helal Kesim Sertifikalı"
    ],
    specs: [
      { label: "Menşei", value: "Afyonkarahisar / Türkiye" },
      { label: "Üretim Şekli", value: "Geleneksel Doğal Fermantasyon" },
      { label: "Seçenek", value: "Acılı / Acısız" }
    ]
  },
  {
    id: 2,
    name: "Baton Sucuk",
    category: "Baton Sucuk",
    tag: "Pratik",
    tagColor: "bg-amber-500 text-neutral-950 font-bold",
    description: "Pratik tüketim için ideal baton formunda, geleneksel reçeteyle üretilmiş, doğal fermente Afyon sucuğu.",
    pricePerKg: 400,
    stockKg: 280,
    isActive: true,
    imageUrl: "/uploads/1790690316545_sucuk_duzenleme_19_UHD.jpg",
    rating: 4.8,
    reviewsCount: 184,
    packages: [
      { kg: 1, price: 400 },
      { kg: 5, price: 1800, gift: 1 },
      { kg: 7, price: 2100, gift: 1.5 },
      { kg: 10, price: 3500, gift: 2 }
    ],
    features: [
      "%100 Afyon Sucuğu",
      "Doğal Bağırsak",
      "Geleneksel Kurutma",
      "Katkısız & Koruyucusuz"
    ],
    specs: [
      { label: "Menşei", value: "Afyonkarahisar" },
      { label: "Form", value: "Baton" }
    ]
  },
  {
    id: 3,
    name: "Bez Sucuk",
    category: "Bez Sucuk",
    tag: "Geleneksel",
    tagColor: "bg-emerald-600 text-white",
    description: "Geleneksel bez yöntemiyle sarılarak dinlendirilmiş, yoğun aromalı ve uzun raf ömürlü özel Afyon sucuğu.",
    pricePerKg: 550,
    stockKg: 320,
    isActive: true,
    imageUrl: "/uploads/1790690334386_sucuk_duzenleme_14_UHD.jpg",
    rating: 4.9,
    reviewsCount: 146,
    packages: [
      { kg: 1, price: 550 },
      { kg: 5, price: 2750 },
      { kg: 7, price: 3850 },
      { kg: 10, price: 5500 }
    ],
    features: [
      "%100 Afyon Sucuğu",
      "Geleneksel Bez Yöntemi",
      "Doğal Bağırsak",
      "Yoğun Aromalı"
    ],
    specs: [
      { label: "Menşei", value: "Afyonkarahisar" },
      { label: "Ambalaj", value: "Geleneksel Bez" }
    ]
  }
];

const defaultSettings: StoredSettings = {
  siteName: "Ardabey Sucukları",
  supportPhone: "0850 308 19 23",
  whatsappPhone: "+90 532 123 45 67",
  logoUrl: "/uploads/logo.png",
  banner1: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1600",
  banner2: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=1600",
  freeShippingKg: 3,
  bulkDiscountKg: 5
};

const defaultOrders: StoredOrder[] = [
  {
    id: "#ORD-9841",
    customerName: "Ahmet Yılmaz",
    phone: "0532 555 12 34",
    email: "ahmet.yilmaz@gmail.com",
    address: "Bağdat Caddesi No: 142 Daire: 8, Suadiye",
    city: "İstanbul",
    district: "Kadıköy",
    items: "Afyon Sucuğu (Acılı)",
    itemsList: [
      { name: "Afyon Sucuğu (Acılı)", kg: 5, quantity: 1, pricePerKg: 350, totalPrice: 1750 }
    ],
    kg: 5,
    total: 1750,
    paymentMethod: "Kapıda Nakit",
    status: "Hazırlanıyor",
    trackingNumber: "YK-9841-34-IST",
    cargoCompany: "Yurtiçi Kargo (Soğuk Dağıtım)",
    date: "Bugün 14:20",
    notes: "Öğleden sonra teslim edilirse sevinirim."
  },
  {
    id: "#ORD-9840",
    customerName: "Selin Demir",
    phone: "0544 333 44 55",
    email: "selin.demir@hotmail.com",
    address: "Arjantin Caddesi No: 28 Kat: 3",
    city: "Ankara",
    district: "Çankaya",
    items: "Baton Sucuk",
    itemsList: [
      { name: "Baton Sucuk", kg: 7, quantity: 1, pricePerKg: 300, totalPrice: 2100 }
    ],
    kg: 7,
    total: 2100,
    paymentMethod: "Kredi Kartı (Online)",
    status: "Kargolandı",
    trackingNumber: "MNG-4820-ANK",
    cargoCompany: "MNG Kargo (Termal Kutu)",
    date: "Bugün 11:45",
    notes: "Zil çalmasın lütfen bebek uyuyor."
  },
  {
    id: "#ORD-9839",
    customerName: "Mehmet Çelik",
    phone: "0555 777 88 99",
    email: "m.celik35@gmail.com",
    address: "Cemal Gürsel Cad. No: 65/2, Bostanlı",
    city: "İzmir",
    district: "Karşıyaka",
    items: "Bez Sucuk",
    itemsList: [
      { name: "Bez Sucuk", kg: 10, quantity: 1, pricePerKg: 550, totalPrice: 5500 }
    ],
    kg: 10,
    total: 5500,
    paymentMethod: "Havale / EFT",
    status: "Teslim Edildi",
    trackingNumber: "YK-8821-35-IZM",
    cargoCompany: "Yurtiçi Kargo (Soğuk Dağıtım)",
    date: "Dün 17:10",
    notes: "Kapıcıya bırakılabilir."
  },
  {
    id: "#ORD-9838",
    customerName: "Mustafa Özkan (Özkan Kasap & Restoran)",
    phone: "0533 888 99 00",
    email: "ozkan.restoran@gmail.com",
    address: "Fatih Sultan Mehmet Bulvarı No: 88, İhsaniye",
    city: "Bursa",
    district: "Nilüfer",
    items: "Afyon Sucuğu (Toptan)",
    itemsList: [
      { name: "Afyon Sucuğu", kg: 10, quantity: 1, pricePerKg: 350, totalPrice: 3500 }
    ],
    kg: 10,
    total: 3500,
    paymentMethod: "Kapıda Kredi Kartı",
    status: "Kargolandı",
    trackingNumber: "ARAS-7193-BURSA",
    cargoCompany: "Aras Kargo (Özel Paletli Sevk)",
    date: "Dün 09:30",
    notes: "Toptan faturalı gönderim."
  }
];

const defaultPaymentSettings: StoredPaymentSettings = {
  iyzico: {
    enabled: true,
    testMode: true,
    apiKey: "sandbox-2718281828459045",
    secretKey: "sandbox-secret-3141592653589793",
    baseUrl: "https://sandbox-api.iyzipay.com"
  },
  paytr: {
    enabled: true,
    testMode: true,
    merchantId: "482910",
    merchantKey: "merchant-key-test-8491",
    merchantSalt: "merchant-salt-test-7291",
    maxInstallments: 6
  },
  cashOnDelivery: {
    enabled: true,
    extraFee: 0
  },
  cardOnDelivery: {
    enabled: true,
    extraFee: 0
  },
  bankTransfer: {
    enabled: true,
    accounts: [
      {
        id: "ziraat",
        bankName: "Ziraat Bankası",
        accountHolder: "Ardabey Sucukları Gıda San. Tic. Ltd. Şti.",
        iban: "TR12 0001 0000 1234 5678 9012 34",
        branch: "Afyonkarahisar Şubesi (1234)"
      },
      {
        id: "isbank",
        bankName: "Türkiye İş Bankası",
        accountHolder: "Ardabey Sucukları Gıda San. Tic. Ltd. Şti.",
        iban: "TR56 0006 4000 0011 2233 4455 66",
        branch: "Afyonkarahisar Çarşı Şubesi (4000)"
      },
      {
        id: "garanti",
        bankName: "Garanti BBVA",
        accountHolder: "Ardabey Sucukları Gıda San. Tic. Ltd. Şti.",
        iban: "TR88 0006 2000 0009 8877 6655 44",
        branch: "Organize Sanayi Şubesi (2000)"
      }
    ],
    instructions: "Lütfen havale/EFT açıklama kısmına Ad-Soyad ve Sipariş Numaranızı yazınız. Ödeme kontrol edildikten sonra siparişiniz özel soğuk zincir strafor kutularda kargoya verilir."
  }
};

// Helper: map Supabase product row to StoredProduct
function mapSupabaseProduct(row: any): StoredProduct {
  return {
    id: Number(row.id),
    name: row.name,
    category: row.category,
    tag: row.tag || "",
    tagColor: row.tag_color || "bg-red-600 text-white",
    description: row.description || "",
    pricePerKg: Number(row.price_per_kg),
    stockKg: Number(row.stock_kg),
    isActive: Boolean(row.is_active),
    imageUrl: row.image_url || "",
    rating: Number(row.rating || 5.0),
    reviewsCount: Number(row.reviews_count || 0),
    features: row.features || [],
    specs: row.specs || [],
    packages: row.packages || [],
    variants: row.variants || []
  };
}

// -------------------------------------------------------------
// 1. PRODUCTS OPERATIONS
// -------------------------------------------------------------
export async function getStoredProducts(): Promise<StoredProduct[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Supabase getStoredProducts error:", error);
      } else if (data && data.length > 0) {
        return data.map(mapSupabaseProduct);
      }
    } catch (e) {
      console.error("Supabase connection error in getStoredProducts:", e);
    }
  }

  // Fallback to local JSON
  ensureDataDir();
  if (!fs.existsSync(PRODUCTS_FILE)) {
    try {
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(defaultProducts, null, 2), "utf-8");
    } catch {}
    return defaultProducts;
  }
  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return defaultProducts;
  }
}

export async function getStoredProductById(id: number): Promise<StoredProduct | undefined> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!error && data) {
        return mapSupabaseProduct(data);
      }
    } catch (e) {
      console.error("Supabase getStoredProductById error:", e);
    }
  }

  const products = await getStoredProducts();
  return products.find(p => p.id === id);
}

export async function updateStoredProduct(id: number, updates: Partial<StoredProduct>): Promise<StoredProduct | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const payload: Record<string, any> = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.category !== undefined) payload.category = updates.category;
      if (updates.tag !== undefined) payload.tag = updates.tag;
      if (updates.tagColor !== undefined) payload.tag_color = updates.tagColor;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.pricePerKg !== undefined) payload.price_per_kg = updates.pricePerKg;
      if (updates.stockKg !== undefined) payload.stock_kg = updates.stockKg;
      if (updates.isActive !== undefined) payload.is_active = updates.isActive;
      if (updates.imageUrl !== undefined) payload.image_url = updates.imageUrl;
      if (updates.rating !== undefined) payload.rating = updates.rating;
      if (updates.reviewsCount !== undefined) payload.reviews_count = updates.reviewsCount;
      if (updates.features !== undefined) payload.features = updates.features;
      if (updates.specs !== undefined) payload.specs = updates.specs;
      if (updates.packages !== undefined) payload.packages = updates.packages;
      if (updates.variants !== undefined) payload.variants = updates.variants;

      const { data, error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", id)
        .select()
        .maybeSingle();

      if (!error && data) {
        return mapSupabaseProduct(data);
      }
    } catch (e) {
      console.error("Supabase updateStoredProduct error:", e);
    }
  }

  // Local JSON fallback
  const products = await getStoredProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;

  products[index] = { ...products[index], ...updates };
  persistJson(PRODUCTS_FILE, products);
  return products[index];
}

export async function createStoredProduct(newProd: Omit<StoredProduct, "id"> & { id?: number }): Promise<StoredProduct> {
  const products = await getStoredProducts();
  const id = newProd.id || (products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1);

  const created: StoredProduct = {
    ...newProd,
    id,
    tag: newProd.tag || "Yeni Ürün",
    tagColor: newProd.tagColor || "bg-red-600 text-white",
    rating: newProd.rating || 5.0,
    reviewsCount: newProd.reviewsCount || 0,
    features: newProd.features || [],
    specs: newProd.specs || [],
    packages: newProd.packages || [],
    variants: newProd.variants || []
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert({
          id: created.id,
          name: created.name,
          category: created.category,
          tag: created.tag,
          tag_color: created.tagColor,
          description: created.description,
          price_per_kg: created.pricePerKg,
          stock_kg: created.stockKg,
          is_active: created.isActive,
          image_url: created.imageUrl,
          rating: created.rating,
          reviews_count: created.reviewsCount,
          features: created.features,
          specs: created.specs,
          packages: created.packages,
          variants: created.variants
        })
        .select()
        .maybeSingle();

      if (!error && data) {
        return mapSupabaseProduct(data);
      }
    } catch (e) {
      console.error("Supabase createStoredProduct error:", e);
    }
  }

  // Local fallback
  products.unshift(created);
  persistJson(PRODUCTS_FILE, products);
  return created;
}

export async function deleteStoredProduct(id: number): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (!error) return true;
    } catch (e) {
      console.error("Supabase deleteStoredProduct error:", e);
    }
  }

  const products = await getStoredProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  persistJson(PRODUCTS_FILE, filtered);
  return true;
}

// -------------------------------------------------------------
// 2. SETTINGS OPERATIONS
// -------------------------------------------------------------
export async function getStoredSettings(): Promise<StoredSettings> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (!error && data) {
        return {
          siteName: data.site_name,
          supportPhone: data.support_phone,
          whatsappPhone: data.whatsapp_phone,
          logoUrl: data.logo_url || "",
          banner1: data.banner1 || defaultSettings.banner1,
          banner2: data.banner2 || defaultSettings.banner2,
          freeShippingKg: Number(data.free_shipping_kg || 3),
          bulkDiscountKg: Number(data.bulk_discount_kg || 5)
        };
      }
    } catch (e) {
      console.error("Supabase getStoredSettings error:", e);
    }
  }

  ensureDataDir();
  if (!fs.existsSync(SETTINGS_FILE)) {
    try {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2), "utf-8");
    } catch {}
    return defaultSettings;
  }
  try {
    const raw = fs.readFileSync(SETTINGS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return defaultSettings;
  }
}

export async function updateStoredSettings(updates: Partial<StoredSettings>): Promise<StoredSettings> {
  const current = await getStoredSettings();
  const updated: StoredSettings = { ...current, ...updates };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("settings").upsert({
        id: 1,
        site_name: updated.siteName,
        support_phone: updated.supportPhone,
        whatsapp_phone: updated.whatsappPhone,
        logo_url: updated.logoUrl,
        banner1: updated.banner1,
        banner2: updated.banner2,
        free_shipping_kg: updated.freeShippingKg,
        bulk_discount_kg: updated.bulkDiscountKg,
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.error("Supabase updateStoredSettings error:", e);
    }
  }

  persistJson(SETTINGS_FILE, updated);
  return updated;
}

// -------------------------------------------------------------
// 3. ORDERS OPERATIONS
// -------------------------------------------------------------
function mapSupabaseOrder(row: any): StoredOrder {
  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone,
    email: row.email || "",
    address: row.address || "",
    city: row.city || "İstanbul",
    district: row.district || "",
    items: row.items || "",
    itemsList: row.items_list || [],
    kg: Number(row.kg || 1),
    total: Number(row.total || 0),
    paymentMethod: row.payment_method || "Kapıda Nakit",
    status: row.status || "Hazırlanıyor",
    trackingNumber: row.tracking_number || "",
    cargoCompany: row.cargo_company || "Yurtiçi Kargo (Soğuk Dağıtım)",
    date: row.date || "Yeni Sipariş",
    notes: row.notes || ""
  };
}

export async function getStoredOrders(): Promise<StoredOrder[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(mapSupabaseOrder);
      }
    } catch (e) {
      console.error("Supabase getStoredOrders error:", e);
    }
  }

  ensureDataDir();
  if (!fs.existsSync(ORDERS_FILE)) {
    try {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(defaultOrders, null, 2), "utf-8");
    } catch {}
    return defaultOrders;
  }
  try {
    const raw = fs.readFileSync(ORDERS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return defaultOrders;
  }
}

export async function createStoredOrder(order: Omit<StoredOrder, "id" | "date" | "status" | "trackingNumber" | "cargoCompany"> & {
  status?: StoredOrder["status"];
  trackingNumber?: string;
  cargoCompany?: string;
}): Promise<StoredOrder> {
  const idNumber = Math.floor(1000 + Math.random() * 9000);
  const newOrder: StoredOrder = {
    ...order,
    id: `#ORD-${idNumber}`,
    status: order.status || "Hazırlanıyor",
    trackingNumber: order.trackingNumber || `YK-${idNumber}-${Math.floor(10 + Math.random() * 89)}`,
    cargoCompany: order.cargoCompany || "Yurtiçi Kargo (Soğuk Dağıtım)",
    date: "Bugün " + new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .insert({
          id: newOrder.id,
          customer_name: newOrder.customerName,
          phone: newOrder.phone,
          email: newOrder.email || "",
          address: newOrder.address,
          city: newOrder.city,
          district: newOrder.district,
          items: newOrder.items,
          items_list: newOrder.itemsList || [],
          kg: newOrder.kg,
          total: newOrder.total,
          payment_method: newOrder.paymentMethod,
          status: newOrder.status,
          tracking_number: newOrder.trackingNumber,
          cargo_company: newOrder.cargoCompany,
          date: newOrder.date,
          notes: newOrder.notes || ""
        })
        .select()
        .maybeSingle();

      if (!error && data) {
        return mapSupabaseOrder(data);
      }
    } catch (e) {
      console.error("Supabase createStoredOrder error:", e);
    }
  }

  // Local fallback
  const orders = await getStoredOrders();
  orders.unshift(newOrder);
  persistJson(ORDERS_FILE, orders);
  return newOrder;
}

export async function updateStoredOrderStatus(id: string, status: StoredOrder["status"]): Promise<StoredOrder | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id)
        .select()
        .maybeSingle();

      if (!error && data) {
        return mapSupabaseOrder(data);
      }
    } catch (e) {
      console.error("Supabase updateStoredOrderStatus error:", e);
    }
  }

  const orders = await getStoredOrders();
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) return null;
  orders[index].status = status;
  persistJson(ORDERS_FILE, orders);
  return orders[index];
}

// -------------------------------------------------------------
// 4. PAYMENTS OPERATIONS
// -------------------------------------------------------------
export async function getStoredPaymentSettings(): Promise<StoredPaymentSettings> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("payment_settings")
        .select("data")
        .eq("id", 1)
        .maybeSingle();

      if (!error && data?.data) {
        return data.data as StoredPaymentSettings;
      }
    } catch (e) {
      console.error("Supabase getStoredPaymentSettings error:", e);
    }
  }

  ensureDataDir();
  if (!fs.existsSync(PAYMENTS_FILE)) {
    try {
      fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(defaultPaymentSettings, null, 2), "utf-8");
    } catch {}
    return defaultPaymentSettings;
  }
  try {
    const raw = fs.readFileSync(PAYMENTS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return defaultPaymentSettings;
  }
}

export async function updateStoredPaymentSettings(updates: Partial<StoredPaymentSettings>): Promise<StoredPaymentSettings> {
  const current = await getStoredPaymentSettings();
  const updated: StoredPaymentSettings = {
    ...current,
    ...updates,
    iyzico: updates.iyzico ? { ...current.iyzico, ...updates.iyzico } : current.iyzico,
    paytr: updates.paytr ? { ...current.paytr, ...updates.paytr } : current.paytr,
    cashOnDelivery: updates.cashOnDelivery ? { ...current.cashOnDelivery, ...updates.cashOnDelivery } : current.cashOnDelivery,
    cardOnDelivery: updates.cardOnDelivery ? { ...current.cardOnDelivery, ...updates.cardOnDelivery } : current.cardOnDelivery,
    bankTransfer: updates.bankTransfer ? { ...current.bankTransfer, ...updates.bankTransfer } : current.bankTransfer
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("payment_settings").upsert({
        id: 1,
        data: updated,
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.error("Supabase updateStoredPaymentSettings error:", e);
    }
  }

  persistJson(PAYMENTS_FILE, updated);
  return updated;
}
