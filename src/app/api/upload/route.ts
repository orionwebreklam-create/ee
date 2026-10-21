import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Lütfen bir dosya seçin." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate clean safe filename
    const ext = path.extname(file.name) || ".jpg";
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueFilename = `${Date.now()}_${baseName}${ext}`;

    // 1. SUPABASE STORAGE (Cloud / Vercel-ready)
    if (isSupabaseConfigured && supabase) {
      try {
        // Try uploading to 'uploads' bucket
        let { data, error } = await supabase.storage
          .from("uploads")
          .upload(uniqueFilename, buffer, {
            contentType: file.type || "image/jpeg",
            upsert: true,
          });

        // If bucket does not exist, create it as public and retry
        if (error && error.message?.toLowerCase().includes("bucket not found")) {
          await supabase.storage.createBucket("uploads", { public: true });
          const retry = await supabase.storage
            .from("uploads")
            .upload(uniqueFilename, buffer, {
              contentType: file.type || "image/jpeg",
              upsert: true,
            });
          error = retry.error;
          data = retry.data;
        }

        if (error) {
          console.error("Supabase Storage upload error:", error);
          throw error;
        }

        const { data: publicData } = supabase.storage
          .from("uploads")
          .getPublicUrl(uniqueFilename);

        return NextResponse.json({
          success: true,
          url: publicData.publicUrl,
          fileName: file.name,
          storage: "supabase",
        });
      } catch (cloudErr) {
        console.error("Cloud storage failed, checking local fallback:", cloudErr);
        // If not in Vercel read-only environment, can fallback to local
        if (process.env.VERCEL) {
          return NextResponse.json(
            { error: "Bulut depolamaya yüklenirken hata oluştu." },
            { status: 500 }
          );
        }
      }
    }

    // 2. LOCAL DISK FALLBACK (Local development without Supabase credentials)
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, uniqueFilename);
    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: file.name,
      storage: "local",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Dosya yüklenirken bir hata oluştu." }, { status: 500 });
  }
}
