import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import { CartProvider } from "@/context/CartContext";
import { UserAuthProvider } from "@/context/UserAuthContext";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserAuthProvider>
      <CartProvider>
        <div className="w-full max-w-full overflow-x-hidden min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow w-full max-w-full overflow-x-hidden">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </CartProvider>
    </UserAuthProvider>
  );
}
