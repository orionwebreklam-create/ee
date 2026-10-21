"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, X, ArrowRight } from "lucide-react";

export interface CartItem {
  id: string;
  productId: number;
  name: string;
  kg: number;
  quantity: number;
  pricePerKg: number;
  totalPrice: number;
  image: string;
}

interface ToastData {
  id: number;
  productName: string;
  kg: number;
  quantity: number;
  totalPrice: number;
  image: string;
}

interface FlyingItemData {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: { id: number; name: string; pricePerKg: number; image?: string },
    kg: number,
    quantity?: number,
    clickEvent?: React.MouseEvent
  ) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartBumping: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartBumping, setIsCartBumping] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [flyingItems, setFlyingItems] = useState<FlyingItemData[]>([]);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ardabey_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      } else {
        // Initial sample item
        setItems([
          {
            id: "initial-1",
            productId: 1,
            name: "Özel Afyon Kangal Sucuk",
            kg: 5,
            quantity: 1,
            pricePerKg: 540,
            totalPrice: 2700,
            image: "https://images.unsplash.com/photo-1589304198126-79c2a382101e?auto=format&fit=crop&w=150&q=80"
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem("ardabey_cart", JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  const addToCart = (
    product: { id: number; name: string; pricePerKg: number; image?: string },
    kg: number,
    quantity = 1,
    clickEvent?: React.MouseEvent
  ) => {
    // 5kg and above gives 50 TL discount per kg
    const discountPerKg = kg >= 5 ? 50 : 0;
    const effectivePricePerKg = product.pricePerKg - discountPerKg;
    const itemTotal = effectivePricePerKg * kg * quantity;
    const img = product.image || "https://images.unsplash.com/photo-1589304198126-79c2a382101e?auto=format&fit=crop&w=150&q=80";

    const newItem: CartItem = {
      id: `${product.id}-${kg}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      kg,
      quantity,
      pricePerKg: effectivePricePerKg,
      totalPrice: itemTotal,
      image: img
    };

    setItems((prev) => [newItem, ...prev]);

    // 1. Trigger Flying Animation to Header Cart
    if (clickEvent) {
      const startX = clickEvent.clientX;
      const startY = clickEvent.clientY;

      // Try finding the header cart button coordinates
      const cartBtn = document.getElementById("header-cart-icon");
      let targetX = window.innerWidth - 70;
      let targetY = 60;

      if (cartBtn) {
        const rect = cartBtn.getBoundingClientRect();
        targetX = rect.left + rect.width / 2;
        targetY = rect.top + rect.height / 2;
      }

      const flyId = Date.now();
      setFlyingItems((prev) => [
        ...prev,
        { id: flyId, startX, startY, targetX, targetY, image: img }
      ]);

      // Remove flying element after animation finishes
      setTimeout(() => {
        setFlyingItems((prev) => prev.filter((f) => f.id !== flyId));
        // Bump header cart when flying object arrives
        setIsCartBumping(true);
        setTimeout(() => setIsCartBumping(false), 600);
      }, 750);
    } else {
      setIsCartBumping(true);
      setTimeout(() => setIsCartBumping(false), 600);
    }

    // 2. Trigger Modern Green Bottom-Right Toast
    const toastId = Date.now();
    const newToast: ToastData = {
      id: toastId,
      productName: product.name,
      kg,
      quantity,
      totalPrice: itemTotal,
      image: img
    };

    setToasts((prev) => [newToast, ...prev.slice(0, 2)]);

    // Auto dismiss after 3.8s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 3800);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = items.reduce((sum, i) => sum + i.totalPrice, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
        isCartBumping
      }}
    >
      {children}

      {/* 3. Flying Cart Particles Layer */}
      {flyingItems.map((fly) => (
        <div
          key={fly.id}
          className="fixed z-[100] pointer-events-none rounded-full shadow-2xl border-2 border-amber-400 overflow-hidden"
          style={{
            left: `${fly.startX}px`,
            top: `${fly.startY}px`,
            width: "48px",
            height: "48px",
            animation: `flyToCart 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
            // @ts-ignore
            "--target-x": `${fly.targetX - fly.startX}px`,
            "--target-y": `${fly.targetY - fly.startY}px`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fly.image} alt="Uçan Sucuk" className="w-full h-full object-cover" />
        </div>
      ))}

      {/* 4. Modern Green "Sepete Eklendi" Toast (Bottom Right) */}
      <div className="fixed bottom-24 sm:bottom-28 right-4 sm:right-6 z-50 flex flex-col space-y-3 pointer-events-none w-[calc(100vw-2rem)] max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-neutral-900/95 border-2 border-emerald-500/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-toast-in text-neutral-100 flex flex-col space-y-3 relative overflow-hidden"
            style={{
              boxShadow: "0 10px 30px -5px rgba(16, 185, 129, 0.3)"
            }}
          >
            {/* Top notification header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span>Sepete Başarıyla Eklendi!</span>
              </div>
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="text-neutral-400 hover:text-white p-1 transition-colors"
                aria-label="Kapat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Product details snippet */}
            <div className="flex items-center space-x-3 bg-neutral-950/70 p-2.5 rounded-xl border border-neutral-800">
              <div className="h-12 w-12 rounded-lg overflow-hidden bg-neutral-900 shrink-0 border border-neutral-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={toast.image} alt={toast.productName} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{toast.productName}</h4>
                <div className="flex items-center space-x-2 text-[11px] text-neutral-400 mt-0.5">
                  <span className="text-amber-400 font-bold">{toast.kg} KG Paket</span>
                  <span>•</span>
                  <span className="font-bold text-white">{toast.totalPrice.toLocaleString("tr-TR")} ₺</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-2 pt-1">
              <Link
                href="/cart"
                className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:scale-[1.02] active:scale-98"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Sepeti Görüntüle</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Tiny progress line for auto dismiss */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-800">
              <div 
                className="h-full bg-emerald-500 transition-all duration-3800 ease-linear"
                style={{ width: "100%", animation: "shrinkWidth 3.8s linear forwards" }}
              />
            </div>
          </div>
        ))}
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
