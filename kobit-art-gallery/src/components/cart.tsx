"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import Link from "next/link";
import { Artwork } from "@/lib/data";

interface CartItem {
  artwork: Artwork;
  qty: number;
}

interface CartContextType {
  items: CartItem[];
  count: number;
  total: number;
  add: (artwork: Artwork) => void;
  remove: (id: string) => void;
  clear: () => void;
  isOpen: boolean;
  setOpen: (v: boolean) => void;
}

const CartCtx = createContext<CartContextType>({
  items: [], count: 0, total: 0,
  add: () => {}, remove: () => {}, clear: () => {},
  isOpen: false, setOpen: () => {},
});

export const useCart = () => useContext(CartCtx);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);

  const add = useCallback((artwork: Artwork) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.artwork.id === artwork.id);
      if (existing) return prev;
      return [...prev, { artwork, qty: 1 }];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.artwork.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = items.length;
  const total = items.reduce((s, i) => s + i.artwork.price * i.qty, 0);

  return (
    <CartCtx.Provider value={{ items, count, total, add, remove, clear, isOpen, setOpen }}>
      {children}
      {isOpen && <CartDrawer />}
    </CartCtx.Provider>
  );
}

function CartDrawer() {
  const { items, total, remove, clear, setOpen } = useCart();

  return (
    <>
      <div className="cart-overlay" onClick={() => setOpen(false)} />
      <aside className="cart-drawer">
        <div className="cart-drawer__head">
          <h2 className="display" style={{ fontSize: "1.6rem", margin: 0 }}>Your Cart</h2>
          <button className="cart-drawer__close" onClick={() => setOpen(false)}>&#x2715;</button>
        </div>

        {items.length === 0 ? (
          <p className="serif-body" style={{ padding: "2rem 1.8rem", opacity: 0.6 }}>Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-drawer__items">
              {items.map((item) => (
                <div key={item.artwork.id} className="cart-item">
                  <div className="cart-item__info">
                    <span className="cart-item__title">{item.artwork.title}</span>
                    <span className="meta">{item.artwork.size} &middot; {item.artwork.medium}</span>
                  </div>
                  <div className="cart-item__right">
                    <span className="cart-item__price">Rs {item.artwork.price.toLocaleString()}</span>
                    <button className="cart-item__rm" onClick={() => remove(item.artwork.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-drawer__foot">
              <div className="cart-drawer__total">
                <span className="meta">Total</span>
                <span className="display" style={{ fontSize: "1.4rem" }}>Rs {total.toLocaleString()}</span>
              </div>
              <Link
                href="/checkout"
                className="btn"
                style={{ width: "100%", justifyContent: "center", textAlign: "center" }}
                onClick={() => setOpen(false)}
              >
                Proceed to Payment <span className="arr">&rarr;</span>
              </Link>
              <button className="link-u" onClick={clear} style={{ marginTop: ".8rem", fontSize: ".85rem" }}>
                Clear cart
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
