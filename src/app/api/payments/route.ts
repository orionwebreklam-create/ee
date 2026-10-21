import { NextRequest, NextResponse } from "next/server";
import { getStoredPaymentSettings, updateStoredPaymentSettings } from "@/lib/dataStore";

export async function GET() {
  try {
    const settings = await getStoredPaymentSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("GET /api/payments error:", error);
    return NextResponse.json({ error: "Ödeme ayarları getirilemedi." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await updateStoredPaymentSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("POST /api/payments error:", error);
    return NextResponse.json({ error: "Ödeme ayarları kaydedilemedi." }, { status: 500 });
  }
}
