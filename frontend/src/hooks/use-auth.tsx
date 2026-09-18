"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@/types";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/me/");
      if (response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
        localStorage.removeItem("access_token");
      }
    } catch {
      setUser(null);
      localStorage.removeItem("access_token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post("/auth/login/", { email, password });
    const { access, user: userData } = response.data;
    localStorage.setItem("access_token", access);
    setUser(userData);
    toast.success("Welcome back!");
    router.push("/");
    router.refresh();
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.post("/auth/register/", { name, email, password, confirm: password });
    const { access, user: userData } = response.data;
    localStorage.setItem("access_token", access);
    setUser(userData);
    toast.success("Account created successfully!");
    router.push("/");
    router.refresh();
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout/");
    } catch {
      // Ignore logout errors
    } finally {
      localStorage.removeItem("access_token");
      setUser(null);
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}