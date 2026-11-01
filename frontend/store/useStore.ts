'use client';
import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import type { CartLine } from '@/lib/types';

export type Currency = 'NPR' | 'USD';
export interface Fly { id: number; image: string; aspect: number; from: { x: number; y: number; w: number; h: number } }
export interface Toast { id: number; msg: string }

// localStorage can throw (private windows, blocked storage) — never let it break the app.
const safeStorage: StateStorage = {
  getItem: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  setItem: (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
  removeItem: (k) => { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};

interface State {
  lines: CartLine[];
  wishlist: string[];
  currency: Currency;
  menuOpen: boolean;
  cartOpen: boolean;
  searchOpen: boolean;
  lightboxOpen: boolean;
  ready: boolean;
  toasts: Toast[];
  flies: Fly[];
  addLine: (l: Omit<CartLine, 'qty'>, qty?: number) => void;
  removeLine: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clearCart: () => void;
  toggleWish: (id: string) => void;
  setCurrency: (c: Currency) => void;
  setMenu: (v: boolean) => void;
  setCart: (v: boolean) => void;
  setSearch: (v: boolean) => void;
  setLightbox: (v: boolean) => void;
  setReady: (v: boolean) => void;
  toast: (msg: string) => void;
  dismissToast: (id: number) => void;
  fly: (f: Omit<Fly, 'id'>) => void;
  endFly: (id: number) => void;
}

let uid = 1;

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      lines: [],
      wishlist: [],
      currency: 'NPR', // Default to NPR for Nepal
      menuOpen: false,
      cartOpen: false,
      searchOpen: false,
      lightboxOpen: false,
      ready: false,
      toasts: [],
      flies: [],
      addLine: (l, qty = 1) =>
        set((s) => {
          const i = s.lines.findIndex((x) => x.key === l.key);
          if (i >= 0) {
            const lines = s.lines.slice();
            lines[i] = { ...lines[i], qty: lines[i].qty + qty };
            return { lines };
          }
          return { lines: [...s.lines, { ...l, qty }] };
        }),
      removeLine: (key) => set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),
      setQty: (key, qty) =>
        set((s) => ({ lines: qty <= 0 ? s.lines.filter((l) => l.key !== key) : s.lines.map((l) => (l.key === key ? { ...l, qty } : l)) })),
      clearCart: () => set({ lines: [] }),
      toggleWish: (id) =>
        set((s) => ({ wishlist: s.wishlist.includes(id) ? s.wishlist.filter((x) => x !== id) : [...s.wishlist, id] })),
      setCurrency: (currency) => set({ currency }),
      setMenu: (menuOpen) => set({ menuOpen, ...(menuOpen ? { cartOpen: false, searchOpen: false } : {}) }),
      setCart: (cartOpen) => set({ cartOpen, ...(cartOpen ? { menuOpen: false, searchOpen: false } : {}) }),
      setSearch: (searchOpen) => set({ searchOpen, ...(searchOpen ? { menuOpen: false, cartOpen: false } : {}) }),
      setLightbox: (lightboxOpen) => set({ lightboxOpen }),
      setReady: (ready) => set({ ready }),
      toast: (msg) => {
        const id = uid++;
        set((s) => ({ toasts: [...s.toasts, { id, msg }] }));
        setTimeout(() => get().dismissToast(id), 3200);
      },
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
      fly: (f) => set((s) => ({ flies: [...s.flies, { ...f, id: uid++ }] })),
      endFly: (id) => set((s) => ({ flies: s.flies.filter((f) => f.id !== id) })),
    }),
    {
      name: 'duluwa-store',
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => ({ lines: s.lines, wishlist: s.wishlist, currency: s.currency }),
      skipHydration: true,
      version: 1, // Increment to reset localStorage
      migrate: (persistedState: any, version: number) => {
        // Force currency to NPR on migration
        if (version === 0) {
          return { ...persistedState, currency: 'NPR' };
        }
        return persistedState;
      },
    },
  ),
);

export const cartCount = (lines: CartLine[]) => lines.reduce((n, l) => n + l.qty, 0);
export const cartTotal = (lines: CartLine[]) => lines.reduce((n, l) => n + l.qty * l.unitNPR, 0);
