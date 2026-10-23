import { NextRequest, NextResponse } from "next/server";
import { getStoredSettings, updateStoredSettings } from "@/lib/dataStore";

export async function GET() {
  try {
    const settings = await getStoredSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ error: "Ayarlar getirilemedi." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await updateStoredSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("POST /api/settings error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Ayarlar kaydedilemedi." },
      { status: 500 }
    );
  }
}
