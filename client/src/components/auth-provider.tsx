
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { api } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
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
  const { pathname } = useLocation();

  const refresh = useCallback(() => {
    setLoading(true);
    api.get("/api/auth/me")
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
