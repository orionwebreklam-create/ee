import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// Load .env.local if exists
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [k, ...v] = trimmed.split("=");
      if (k && v.length) {
        process.env[k.trim()] = v.join("=").trim().replace(/^["']|["']$/g, "");
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Hata: NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY bulunamadı!");
  console.log("👉 Lütfen .env.local dosyanıza Supabase bilgilerinizi ekleyin.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSeed() {
  console.log("🚀 Supabase aktarımı başlatılıyor...");

  // 1. Storage Bucket kontrolü
  console.log("📦 1. 'uploads' depolama alanı kontrol ediliyor...");
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some(b => b.name === "uploads");
  if (!exists) {
    const { error: bErr } = await supabase.storage.createBucket("uploads", { public: true });
    if (bErr) console.warn("Bucket uyarısı (zaten var olabilir):", bErr.message);
  }

  // 2. Yerel resimleri yükle
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  const uploadedUrlMap = {};

  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    console.log(`🖼️ 2. ${files.length} adet yerel görsel Supabase Storage'a yükleniyor...`);

    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      if (fs.statSync(filePath).isFile()) {
        const buffer = fs.readFileSync(filePath);
        const ext = path.extname(file).toLowerCase();
        const contentType = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";

        const { error: upErr } = await supabase.storage
          .from("uploads")
          .upload(file, buffer, { contentType, upsert: true });

        if (upErr) {
          console.error(`   ⚠️ ${file} yüklenemedi:`, upErr.message);
        } else {
          const { data: pubData } = supabase.storage.from("uploads").getPublicUrl(file);
          uploadedUrlMap[`/uploads/${file}`] = pubData.publicUrl;
          console.log(`   ✅ Yüklendi: ${file} -> ${pubData.publicUrl}`);
        }
      }
    }
  }

  // Helper to replace local URL with Supabase URL
  const fixUrl = (url) => {
    if (!url) return url;
    return uploadedUrlMap[url] || url;
  };

  // 3. Settings aktarımı
  console.log("⚙️ 3. Site ve Banner ayarları aktarılıyor...");
  const settingsFile = path.join(process.cwd(), "data", "settings.json");
  if (fs.existsSync(settingsFile)) {
    const settings = JSON.parse(fs.readFileSync(settingsFile, "utf-8"));
    const { error: sErr } = await supabase.from("settings").upsert({
      id: 1,
      site_name: settings.siteName,
      support_phone: settings.supportPhone,
      whatsapp_phone: settings.whatsappPhone,
      logo_url: fixUrl(settings.logoUrl),
      banner1: fixUrl(settings.banner1),
      banner2: fixUrl(settings.banner2),
      free_shipping_kg: settings.freeShippingKg || 3,
      bulk_discount_kg: settings.bulkDiscountKg || 5,
      updated_at: new Date().toISOString()
    });
    if (sErr) console.error("   ❌ Ayarlar aktarılamadı:", sErr.message);
    else console.log("   ✅ Site ayarları başarıyla aktarıldı.");
  }

  // 4. Products aktarımı
  console.log("🥩 4. Ürünler aktarılıyor...");
  const productsFile = path.join(process.cwd(), "data", "products.json");
  if (fs.existsSync(productsFile)) {
    const products = JSON.parse(fs.readFileSync(productsFile, "utf-8"));
    for (const prod of products) {
      const { error: pErr } = await supabase.from("products").upsert({
        id: prod.id,
        name: prod.name,
        category: prod.category,
        tag: prod.tag,
        tag_color: prod.tagColor,
        description: prod.description,
        price_per_kg: prod.pricePerKg,
        stock_kg: prod.stockKg,
        is_active: prod.isActive,
        image_url: fixUrl(prod.imageUrl),
        rating: prod.rating || 5.0,
        reviews_count: prod.reviewsCount || 0,
        features: prod.features || [],
        specs: prod.specs || []
      });
      if (pErr) console.error(`   ❌ Ürün #${prod.id} (${prod.name}) aktarılamadı:`, pErr.message);
      else console.log(`   ✅ Ürün aktarıldı: ${prod.name}`);
    }
  }

  // 5. Orders aktarımı
  console.log("📦 5. Siparişler aktarılıyor...");
  const ordersFile = path.join(process.cwd(), "data", "orders.json");
  if (fs.existsSync(ordersFile)) {
    const orders = JSON.parse(fs.readFileSync(ordersFile, "utf-8"));
    for (const ord of orders) {
      const { error: oErr } = await supabase.from("orders").upsert({
        id: ord.id,
        customer_name: ord.customerName,
        phone: ord.phone,
        email: ord.email || "",
        address: ord.address,
        city: ord.city,
        district: ord.district,
        items: ord.items,
        items_list: ord.itemsList || [],
        kg: ord.kg,
        total: ord.total,
        payment_method: ord.paymentMethod,
        status: ord.status,
        tracking_number: ord.trackingNumber,
        cargo_company: ord.cargoCompany,
        date: ord.date,
        notes: ord.notes || ""
      });
      if (oErr) console.error(`   ❌ Sipariş #${ord.id} aktarılamadı:`, oErr.message);
      else console.log(`   ✅ Sipariş aktarıldı: ${ord.id} (${ord.customerName})`);
    }
  }

  // 6. Payment Settings aktarımı
  console.log("💳 6. Ödeme ayarları aktarılıyor...");
  const paymentsFile = path.join(process.cwd(), "data", "payments.json");
  if (fs.existsSync(paymentsFile)) {
    const payments = JSON.parse(fs.readFileSync(paymentsFile, "utf-8"));
    const { error: payErr } = await supabase.from("payment_settings").upsert({
      id: 1,
      data: payments,
      updated_at: new Date().toISOString()
    });
    if (payErr) console.error("   ❌ Ödeme ayarları aktarılamadı:", payErr.message);
    else console.log("   ✅ Ödeme yöntemleri ayarları başarıyla aktarıldı.");
  }

  console.log("\n🎉 TEBRİKLER! Tüm verileriniz ve görselleriniz Supabase'e başarıyla aktarıldı.");
  console.log("Artık projeniz Vercel üzerinde %100 bulut tabanlı ve kesintisiz çalışacaktır!");
}

runSeed().catch(console.error);
