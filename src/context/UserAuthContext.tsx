"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  district?: string;
  address?: string;
}

interface UserAuthContextType {
  user: CustomerUser | null;
  login: (email: string, pass: string) => boolean;
  register: (userData: { name: string; email: string; phone: string; pass: string; city?: string; district?: string }) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ardabey_customer_user");
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const login = (email: string, pass: string) => {
    // Check credentials (or any valid local login)
    if (email && pass) {
      const mockUser: CustomerUser = {
        id: "cust-1",
        name: email.split("@")[0].toUpperCase() || "Değerli Müşterimiz",
        email: email,
        phone: "0532 555 12 34",
        city: "İstanbul",
        district: "Kadıköy",
        address: "Bağdat Cad. No: 124 D:5"
      };
      setUser(mockUser);
      localStorage.setItem("ardabey_customer_user", JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const register = (userData: { name: string; email: string; phone: string; pass: string; city?: string; district?: string }) => {
    const newUser: CustomerUser = {
      id: `cust-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      city: userData.city || "Afyonkarahisar",
      district: userData.district || "Merkez",
      address: ""
    };
    setUser(newUser);
    localStorage.setItem("ardabey_customer_user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ardabey_customer_user");
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error("useUserAuth must be used within a UserAuthProvider");
  }
  return context;
}
