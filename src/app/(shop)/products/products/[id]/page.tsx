"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock data
const product = {
  id: "1",
  name: "Klasik Kangal Sucuk",
  description: "Geleneksel Türk damak tadına uygun, %100 dana eti ve yöresel Afyon baharatlarıyla hazırlanmış klasik kangal sucuk. Özel kurutma odalarında ideal nem ve sıcaklıkta fermente edilmiştir.",
  pricePerKg: 590,
  image: "https://images.unsplash.com/photo-1589304198126-79c2a382101e?auto=format&fit=crop&w=800&q=80",
  features: ["%100 Dana Eti", "Doğal Bağırsak", "Glutensiz", "Katkısız"]
};

const weightOptions = [1, 3, 5, 10, 20];

export default function ProductDetail() {
  const params = useParams();
  const [selectedWeight, setSelectedWeight] = useState(1);
  const [quantity, setQuantity] = useState(1);

  const totalPrice = product.pricePerKg * selectedWeight * quantity;

  const handleAddToCart = () => {
    alert(`${quantity} adet ${selectedWeight}kg ${product.name} sepete eklendi! (Toplam: ${totalPrice} ₺)`);
    // In a real app, this would use Zustand or Context to add to cart
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/products" className="text-gray-500 hover:text-[var(--color-brand-red)]">
          ← Ürünlere Dön
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-12 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        {/* Product Image */}
        <div className="md:w-1/2">
          <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={product.image} 
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4 text-[var(--color-brand-black)]">{product.name}</h1>
          <p className="text-2xl font-bold text-[var(--color-brand-red)] mb-6">
            {product.pricePerKg} ₺ <span className="text-lg text-gray-500 font-normal">/ kg</span>
          </p>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-[var(--color-brand-black)]">Özellikler:</h3>
            <ul className="list-disc list-inside text-gray-600 grid grid-cols-2 gap-2">
              {product.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Weight Selection */}
          <div className="mb-6">
            <h3 className="font-bold mb-3 text-[var(--color-brand-black)]">Ağırlık Seçimi:</h3>
            <div className="flex flex-wrap gap-3">
              {weightOptions.map((weight) => (
                <button
                  key={weight}
                  onClick={() => setSelectedWeight(weight)}
                  className={`px-6 py-3 rounded border-2 font-bold transition-all ${
                    selectedWeight === weight
                      ? "border-[var(--color-brand-red)] bg-[var(--color-brand-red)] text-white"
                      : "border-gray-200 hover:border-[var(--color-brand-red)] text-gray-700"
                  }`}
                >
                  {weight} KG
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-8 flex items-center gap-4">
             <h3 className="font-bold text-[var(--color-brand-black)]">Adet:</h3>
             <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 font-bold"
                >-</button>
                <span className="px-6 py-2 font-semibold bg-white">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 font-bold"
                >+</button>
             </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200 flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-700">Ara Toplam:</span>
            <span className="text-3xl font-bold text-[var(--color-brand-black)]">{totalPrice} ₺</span>
          </div>

          <button 
            onClick={handleAddToCart}
            className="w-full bg-[var(--color-brand-gold)] hover:bg-yellow-600 text-[var(--color-brand-black)] text-xl font-bold py-4 rounded shadow-lg transition-transform hover:scale-[1.02]"
          >
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  );
}
