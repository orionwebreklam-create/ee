import { NextRequest, NextResponse } from "next/server";
import { getStoredOrders, createStoredOrder } from "@/lib/dataStore";

export async function GET() {
  try {
    const orders = await getStoredOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ error: "Siparişler getirilemedi." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.customerName || !body.phone || !body.total) {
      return NextResponse.json({ error: "Eksik sipariş bilgisi." }, { status: 400 });
    }

    const created = await createStoredOrder({
      customerName: body.customerName,
      phone: body.phone,
      email: body.email || "",
      address: body.address || "",
      city: body.city || "İstanbul",
      district: body.district || "Kadıköy",
      items: body.items || "Ardabey Kangal Sucuk",
      itemsList: body.itemsList || [],
      kg: Number(body.kg) || 1,
      total: Number(body.total),
      paymentMethod: body.paymentMethod || "Kapıda Nakit",
      notes: body.notes || ""
    });

    return NextResponse.json({ success: true, order: created });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: "Sipariş oluşturulamadı." }, { status: 500 });
  }
}
