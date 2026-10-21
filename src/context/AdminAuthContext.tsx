"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  adminUser: { name: string; email: string; role: string } | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check local storage for persistent session
    const saved = localStorage.getItem("ardabey_admin_session");
    if (saved === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, pass: string) => {
    // Easy local test credentials
    // Accept either standard admin or any matching credentials
    if ((email === "admin@ardabeysucuklari.com" && pass === "admin") || (email === "admin" && pass === "admin")) {
      setIsAuthenticated(true);
      localStorage.setItem("ardabey_admin_session", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("ardabey_admin_session");
  };

  const adminUser = isAuthenticated ? {
    name: "Ardabey Baş Yönetici",
    email: "admin@ardabeysucuklari.com",
    role: "Süper Admin"
  } : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-amber-400">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-8 w-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold tracking-wider text-neutral-400">Yönetim Paneli Doğrulanıyor...</span>
        </div>
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout, adminUser }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
