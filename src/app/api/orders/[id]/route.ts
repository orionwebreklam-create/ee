import { NextRequest, NextResponse } from "next/server";
import { updateStoredOrderStatus } from "@/lib/dataStore";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    const body = await req.json();

    const updated = await updateStoredOrderStatus(decodedId, body.status);

    if (!updated) {
      return NextResponse.json({ error: "Sipariş bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("PUT /api/orders/[id] error:", error);
    return NextResponse.json({ error: "Sipariş durumu güncellenemedi." }, { status: 500 });
  }
}
