'use client';
import Link from 'next/link';
import { useStore, cartTotal } from '@/store/useStore';
import { byId } from '@/data/artworks';
import Art from '@/components/ui/Art';
import { money } from '@/lib/price';

export default function CartView() {
  const lines = useStore((s) => s.lines);
  const currency = useStore((s) => s.currency);
  const setQty = useStore((s) => s.setQty);
  const removeLine = useStore((s) => s.removeLine);

  if (!lines.length) {
    return (
      <div className="page-pad pb-32 text-center">
        <p className="font-serif text-4xl italic md:text-6xl">Nothing on the wall yet.</p>
        <Link href="/shop" className="btn mt-8">Browse the shop</Link>
      </div>
    );
  }
  return (
    <div className="page-pad grid gap-10 pb-28 md:grid-cols-[1fr_360px]">
      <ul className="border-t border-ink/10">
        {lines.map((l) => {
          const a = byId(l.artworkId);
          if (!a) return null;
          return (
            <li key={l.key} className="flex gap-5 border-b border-ink/10 py-5">
              <div className="flex h-32 w-32 shrink-0 items-center justify-center bg-card p-3">
                <div className="relative w-full bg-white shadow-mat" style={{ aspectRatio: a.aspect }}><Art a={a} fill sizes="128px" className="object-cover" /></div>
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link href={`/artwork/${a.slug}`} className="font-display text-lg font-semibold uppercase tracking-tight">{a.title}</Link>
                  <p className="label mt-1 text-mute">{l.option ?? `Original · ${a.widthCm}×${a.heightCm} cm · 1 of 1`}</p>
                </div>
                <div className="flex items-center justify-between">
                  {a.type === 'print' ? (
                    <div className="flex items-center border border-ink/20">
                      <button type="button" aria-label="Decrease quantity" className="h-8 w-8" onClick={() => setQty(l.key, l.qty - 1)}>−</button>
                      <span className="w-8 text-center text-sm tabular-nums">{l.qty}</span>
                      <button type="button" aria-label="Increase quantity" className="h-8 w-8" onClick={() => setQty(l.key, l.qty + 1)}>+</button>
                    </div>
                  ) : <span />}
                  <span className="font-semibold">{money(l.unitNPR * l.qty, currency)}</span>
                </div>
                <button type="button" onClick={() => removeLine(l.key)} className="label self-start text-mute underline-offset-4 hover:underline">Remove</button>
              </div>
            </li>
          );
        })}
      </ul>
      <aside className="h-fit bg-card p-6 md:sticky md:top-28">
        <h2 className="label mb-4 text-mute">Summary</h2>
        <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">{money(cartTotal(lines), currency)}</span></div>
        <p className="mt-1 text-xs text-mute">Shipping calculated at checkout.</p>
        <Link href="/checkout" className="btn mt-6 w-full">Checkout</Link>
      </aside>
    </div>
  );
}
