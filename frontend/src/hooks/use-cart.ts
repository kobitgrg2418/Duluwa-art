"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Artwork } from "@/types";

interface CartItem {
  artwork: Artwork;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (artwork: Artwork, quantity?: number) => void;
  removeItem: (artworkId: string) => void;
  updateQuantity: (artworkId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  total: number;
  itemCount: number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (artwork: Artwork, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.artwork.id === artwork.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.artwork.id === artwork.id
                  ? { ...item, quantity: Math.min(item.quantity + quantity, 10) }
                  : item
              ),
            };
          }
          return { items: [...state.items, { artwork, quantity }] };
        });
      },

      removeItem: (artworkId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.artwork.id !== artworkId),
        }));
      },

      updateQuantity: (artworkId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(artworkId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.artwork.id === artworkId ? { ...item, quantity: Math.min(quantity, 10) } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      get subtotal() {
        return get().items.reduce((sum, item) => sum + item.artwork.price * item.quantity, 0);
      },

      get total() {
        return get().subtotal;
      },

      get itemCount() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "duluwa-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);