import { NextRequest, NextResponse } from "next/server";
import { getStoredProducts, createStoredProduct } from "@/lib/dataStore";

export async function GET() {
  try {
    const products = await getStoredProducts();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Ürünler getirilemedi." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.pricePerKg) {
      return NextResponse.json({ error: "Ürün adı ve kg fiyatı zorunludur." }, { status: 400 });
    }

    const created = await createStoredProduct({
      name: body.name,
      category: body.category || "Afyon Sucuğu",
      tag: body.tag || "Yeni Ürün",
      description: body.description || "",
      pricePerKg: Number(body.pricePerKg),
      stockKg: Number(body.stockKg) || 100,
      isActive: body.isActive !== undefined ? body.isActive : true,
      imageUrl: body.imageUrl || "/uploads/1790690304656_sucuk_duzenleme_07_UHD.jpg",
      rating: 5.0,
      reviewsCount: 1
    });

    return NextResponse.json({ success: true, product: created });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Ürün kaydedilemedi." },
      { status: 500 }
    );
  }
}
