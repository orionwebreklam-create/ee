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
  console.error("❌ Hata: Supabase bilgileri .env.local dosyasında bulunamadı!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("🚀 Katalog & logo güncellemesi başlatılıyor...\n");

  // 1. Storage bucket kontrolü
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.some((b) => b.name === "uploads")) {
    const { error: bErr } = await supabase.storage.createBucket("uploads", { public: true });
    if (bErr) console.warn("Bucket uyarısı:", bErr.message);
  }

  // 2. Yerel görselleri yükle (logo.png dahil)
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  const uploadedUrlMap = {};
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      if (!fs.statSync(filePath).isFile()) continue;
      const buffer = fs.readFileSync(filePath);
      const ext = path.extname(file).toLowerCase();
      const contentType = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
      const { error: upErr } = await supabase.storage.from("uploads").upload(file, buffer, { contentType, upsert: true });
      if (upErr) console.error(`   ⚠️ ${file} yüklenemedi:`, upErr.message);
      else {
        const { data: pubData } = supabase.storage.from("uploads").getPublicUrl(file);
        uploadedUrlMap[`/uploads/${file}`] = pubData.publicUrl;
        console.log(`   ✅ Görsel yüklendi: ${file}`);
      }
    }
  }

  const fixUrl = (url) => (url && uploadedUrlMap[url]) ? uploadedUrlMap[url] : url;

  // 3. Ayarlar (logo)
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
    if (sErr) console.error("   ❌ Ayarlar:", sErr.message);
    else console.log("   ✅ Logo ve site ayarları güncellendi.");
  }

  // 4. Ürünler (paketler + varyantlar)
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
        specs: prod.specs || [],
        packages: prod.packages || [],
        variants: prod.variants || []
      });
      if (pErr) console.error(`   ❌ ${prod.name}:`, pErr.message);
      else console.log(`   ✅ Ürün: ${prod.name}`);
    }

    // 5. Katalogda olmayan (eski) ürünleri sil
    const seededIds = products.map((p) => p.id);
    const { data: existing } = await supabase.from("products").select("id");
    const staleIds = (existing || []).filter((p) => !seededIds.includes(p.id)).map((p) => p.id);
    for (const staleId of staleIds) {
      const { error: dErr } = await supabase.from("products").delete().eq("id", staleId);
      if (dErr) console.error(`   ❌ Eski ürün silinemedi #${staleId}:`, dErr.message);
      else console.log(`   🗑️ Eski ürün silindi: #${staleId}`);
    }
  }

  console.log("\n🎉 Katalog ve logo başarıyla güncellendi!");
}

run().catch((e) => {
  console.error("❌ Beklenmeyen hata:", e);
  process.exit(1);
});
