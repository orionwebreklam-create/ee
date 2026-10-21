import { NextRequest, NextResponse } from "next/server";
import { getStoredProductById, updateStoredProduct, deleteStoredProduct } from "@/lib/dataStore";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);
    const product = await getStoredProductById(numericId);

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json({ error: "Ürün getirilemedi." }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);
    const body = await req.json();

    const updated = await updateStoredProduct(numericId, {
      ...(body.name && { name: body.name }),
      ...(body.category && { category: body.category }),
      ...(body.tag && { tag: body.tag }),
      ...(body.tagColor && { tagColor: body.tagColor }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.pricePerKg !== undefined && { pricePerKg: Number(body.pricePerKg) }),
      ...(body.stockKg !== undefined && { stockKg: Number(body.stockKg) }),
      ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
      ...(body.imageUrl && { imageUrl: body.imageUrl })
    });

    if (!updated) {
      return NextResponse.json({ error: "Güncellenecek ürün bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error);
    return NextResponse.json({ error: "Ürün güncellenirken hata oluştu." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);
    const deleted = await deleteStoredProduct(numericId);

    if (!deleted) {
      return NextResponse.json({ error: "Silinecek ürün bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Ürün başarıyla silindi." });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json({ error: "Ürün silinemedi." }, { status: 500 });
  }
}
