'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useStore, cartTotal, cartCount } from '@/store/useStore';
import { byId } from '@/data/artworks';
import Art from '@/components/ui/Art';
import { money } from '@/lib/price';
import { EASE_WIPE } from '@/lib/motion';

export default function CartDrawer() {
  const open = useStore((s) => s.cartOpen);
  const setCart = useStore((s) => s.setCart);
  const lines = useStore((s) => s.lines);
  const currency = useStore((s) => s.currency);
  const setQty = useStore((s) => s.setQty);
  const removeLine = useStore((s) => s.removeLine);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setCart(false);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, setCart]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <m.div className="fixed inset-0 z-[125] bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCart(false)} />
          <m.aside
            role="dialog" aria-modal="true" aria-label="Cart"
            className="fixed bottom-0 right-0 top-0 z-[130] flex w-full max-w-[440px] flex-col bg-paper text-ink"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.7, ease: EASE_WIPE }}
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
              <h2 className="font-display text-xl font-bold uppercase tracking-tight">Cart ({cartCount(lines)})</h2>
              <button type="button" onClick={() => setCart(false)} className="label px-2 py-2" aria-label="Close cart">Close ✕</button>
            </div>
            <div data-lenis-prevent className="flex-1 overflow-y-auto px-5">
              {lines.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="font-serif text-2xl italic">Nothing on the wall yet.</p>
                  <Link href="/shop" onClick={() => setCart(false)} className="btn mt-6">Browse the shop</Link>
                </div>
              ) : (
                <ul>
                  {lines.map((l) => {
                    const a = byId(l.artworkId);
                    if (!a) return null;
                    return (
                      <li key={l.key} className="flex gap-4 border-b border-ink/10 py-4">
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center bg-card p-2">
                          <div className="relative w-full bg-white shadow-mat" style={{ aspectRatio: a.aspect }}>
                            <Art a={a} fill sizes="96px" className="object-cover" />
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <Link href={`/artwork/${a.slug}`} onClick={() => setCart(false)} className="font-display text-sm font-semibold uppercase leading-tight tracking-tight">{a.title}</Link>
                            <p className="label mt-1 text-mute">{l.option ?? `Original · ${a.widthCm}×${a.heightCm} cm`}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            {a.type === 'original' ? (
                              <span className="label text-mute">1 of 1</span>
                            ) : (
                              <div className="flex items-center border border-ink/20">
                                <button type="button" aria-label="Decrease quantity" className="h-7 w-7" onClick={() => setQty(l.key, l.qty - 1)}>−</button>
                                <span className="w-6 text-center text-xs tabular-nums">{l.qty}</span>
                                <button type="button" aria-label="Increase quantity" className="h-7 w-7" onClick={() => setQty(l.key, l.qty + 1)}>+</button>
                              </div>
                            )}
                            <span className="text-sm font-semibold">{money(l.unitNPR * l.qty, currency)}</span>
                          </div>
                          <button type="button" onClick={() => removeLine(l.key)} className="label self-start text-mute underline-offset-4 hover:underline">Remove</button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            {lines.length > 0 && (
              <div className="border-t border-ink/10 p-5">
                <div className="mb-1 flex justify-between text-sm"><span>Subtotal</span><span className="font-semibold">{money(cartTotal(lines), currency)}</span></div>
                <p className="mb-4 text-xs text-mute">Shipping calculated at checkout.</p>
                <Link href="/checkout" onClick={() => setCart(false)} className="btn w-full">Checkout</Link>
                <Link href="/cart" onClick={() => setCart(false)} className="label mt-3 block text-center underline-offset-4 hover:underline">View full cart</Link>
              </div>
            )}
          </m.aside>
        </>
      )}
    </AnimatePresence>
  );
}
