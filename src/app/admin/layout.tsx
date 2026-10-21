"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Sliders, 
  LogOut, 
  ExternalLink, 
  Flame, 
  Bell, 
  User, 
  ShieldCheck,
  ChevronRight,
  CreditCard
} from "lucide-react";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout, adminUser } = useAdminAuth();
  const pathname = usePathname();

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  const navLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Ürün Yönetimi", icon: Package },
    { href: "/admin/orders", label: "Siparişler", icon: ShoppingBag, badge: "4 Yeni" },
    { href: "/admin/payments", label: "Ödeme Yöntemleri", icon: CreditCard, badge: "Yeni" },
    { href: "/admin/settings", label: "Site & Banner Ayarları", icon: Sliders },
  ];

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 overflow-hidden font-sans print:h-auto print:bg-white print:overflow-visible">
      
      {/* 1. Left Sidebar */}
      <aside className="w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col justify-between shrink-0 print:hidden">
        
        {/* Sidebar Header */}
        <div>
          <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center space-x-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-900 border border-amber-500/30 p-1 shadow-lg shadow-amber-500/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/uploads/1790692225772_Since_1978.png" alt="Ardabey Sucukları" className="h-full w-full object-contain" />
            </div>
            <div>
              <span className="block text-sm font-black tracking-wider text-white">ARDABEY</span>
              <span className="block text-[10px] text-amber-400 font-bold tracking-widest uppercase">Admin Paneli</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-red-600 text-white shadow-lg shadow-red-900/30 font-bold"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-amber-400 text-neutral-950">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Profile & Logout */}
        <div className="p-4 border-t border-neutral-800 space-y-3">
          {/* Admin User Info */}
          <div className="flex items-center space-x-3 bg-neutral-900/80 p-3 rounded-2xl border border-neutral-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 shrink-0 font-bold text-xs">
              <User className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{adminUser?.name || "Yönetici"}</p>
              <p className="text-[10px] text-emerald-400 font-medium">Süper Admin • Çevrimiçi</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center space-x-1.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-xl border border-neutral-800 transition-colors font-semibold"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Siteyi Gör</span>
            </Link>

            <button
              onClick={logout}
              className="flex items-center justify-center space-x-1.5 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 rounded-xl border border-red-800/40 transition-colors font-semibold"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Çıkış</span>
            </button>
          </div>
        </div>

      </aside>

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-neutral-900/40 print:bg-white print:overflow-visible">
        
        {/* Top Bar */}
        <header className="h-16 bg-neutral-950/80 border-b border-neutral-800 px-6 flex items-center justify-between shrink-0 backdrop-blur-md print:hidden">
          <div className="flex items-center space-x-2 text-xs text-neutral-400">
            <Link href="/admin" className="hover:text-white transition">Admin</Link>
            <ChevronRight className="h-3 w-3 text-neutral-600" />
            <span className="text-white font-semibold">
              {navLinks.find(l => l.href === pathname)?.label || "Yönetim"}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-neutral-400 border border-neutral-800 text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>SSL Korumalı Oturum</span>
            </span>

            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-amber-500/30 transition text-xs font-semibold flex items-center gap-1"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Müşteri Sitesi</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 print:p-0 print:overflow-visible">
          {children}
        </main>

      </div>

    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
}
