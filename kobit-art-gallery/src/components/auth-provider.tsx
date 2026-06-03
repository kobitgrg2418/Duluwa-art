"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthCtx {
  user: User | null;
  loading: boolean;
  refresh: () => void;
}

const Ctx = createContext<AuthCtx>({ user: null, loading: true, refresh: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const refresh = useCallback(() => {
    setLoading(true);
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { refresh(); }, [refresh, pathname]);

  return <Ctx value={{ user, loading, refresh }}>{children}</Ctx>;
}

export function useAuth() {
  return useContext(Ctx);
}
