'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useStore, cartTotal } from '@/store/useStore';
import { useCatalog } from '@/context/CatalogContext';
import Art from '@/components/ui/Art';
import { money } from '@/lib/price';
import { placeOrder, type PaymentMethod } from '@/lib/payments';

const METHODS: { id: PaymentMethod; label: string; note: string }[] = [
  { id: 'esewa', label: 'eSewa', note: 'Pay with your eSewa wallet (NPR)' },
  { id: 'khalti', label: 'Khalti', note: 'Pay with your Khalti wallet (NPR)' },
  { id: 'card', label: 'Card', note: 'Visa / Mastercard via Stripe' },
  { id: 'bank', label: 'Bank transfer', note: 'Details sent after you place the order' },
];

function Field({ id, label, ...rest }: { id: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="label text-mute">{label}</label>
      <input id={id} name={id} {...rest} className="mt-1 w-full border-b border-ink/30 bg-transparent py-2 outline-none focus:border-ink" />
    </div>
  );
}

export default function CheckoutView() {
  const router = useRouter();
  const lines = useStore((s) => s.lines);
  const currency = useStore((s) => s.currency);
  const clearCart = useStore((s) => s.clearCart);
  const { byId, shopConfig } = useCatalog();
  const [ship, setShip] = useState(shopConfig?.shipping_methods[0]?.key || 'standard');
  const [method, setMethod] = useState<PaymentMethod>('esewa');
  const [busy, setBusy] = useState(false);

  const shipping = shopConfig?.shipping_methods.find((s) => s.key === ship) || { key: 'standard', label: 'Standard', days: '5-7 days', price_npr: 500 };
  const sub = cartTotal(lines);
  const total = sub + shipping.price_npr;

  if (!lines.length) {
    return (
      <div className="page-pad pb-32 text-center">
        <p className="font-serif text-4xl italic md:text-6xl">Your cart is empty.</p>
        <Link href="/shop" className="btn mt-8">Browse the shop</Link>
      </div>
    );
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    const res = await placeOrder({
      method, amountNPR: total, email: String(fd.get('email')), shippingId: ship,
      items: lines.map((l) => ({ artworkId: l.artworkId, option: l.option, qty: l.qty, unitNPR: l.unitNPR })),
    });
    setBusy(false);
    if (res.ok) {
      clearCart();
      router.push(`/checkout/success?order=${res.orderId}&status=${res.status}`);
    } else {
      alert(res.message);
    }
  };

  return (
    <form onSubmit={submit} className="page-pad grid gap-12 pb-28 md:grid-cols-[1fr_380px]">
      <div className="space-y-12">
        <section aria-labelledby="c1">
          <h2 id="c1" className="display-md mb-6">Delivery</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="email" type="email" label="Email" required autoComplete="email" />
            <Field id="phone" type="tel" label="Phone / WhatsApp" required autoComplete="tel" />
            <Field id="name" label="Full name" required autoComplete="name" />
            <Field id="country" label="Country" required autoComplete="country-name" />
            <div className="sm:col-span-2"><Field id="address" label="Address" required autoComplete="street-address" /></div>
            <Field id="city" label="City" required autoComplete="address-level2" />
            <Field id="zip" label="Postal code" autoComplete="postal-code" />
          </div>
        </section>

        <section aria-labelledby="c2">
          <h2 id="c2" className="display-md mb-6">Shipping</h2>
          <div className="grid gap-2" role="radiogroup" aria-label="Shipping method">
            {SHIPPING.map((s) => (
              <label key={s.id} className={clsx('flex cursor-pointer items-center justify-between border p-4', ship === s.id ? 'border-ink bg-card' : 'border-ink/20')}>
                <span className="flex items-center gap-3"><input type="radio" name="ship" checked={ship === s.id} onChange={() => setShip(s.id)} className="accent-[var(--accent)]" /><span><span className="font-semibold">{s.label}</span><span className="label ml-3 text-mute">{s.days}</span></span></span>
                <span className="font-semibold">{money(s.npr, currency)}</span>
              </label>
            ))}
          </div>
        </section>

        <section aria-labelledby="c3">
          <h2 id="c3" className="display-md mb-6">Payment</h2>
          <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
            {METHODS.map((p) => (
              <label key={p.id} className={clsx('cursor-pointer border p-4', method === p.id ? 'border-ink bg-card' : 'border-ink/20')}>
                <span className="flex items-center gap-3"><input type="radio" name="pay" checked={method === p.id} onChange={() => setMethod(p.id)} className="accent-[var(--accent)]" /><span className="font-display text-lg font-semibold uppercase">{p.label}</span></span>
                <span className="mt-1 block pl-6 text-xs text-mute">{p.note}</span>
              </label>
            ))}
          </div>
          <p className="mt-3 text-xs text-mute">Demo checkout: no payment is taken. Provider integration points live in <code>lib/payments.ts</code>.</p>
        </section>
      </div>

      <aside className="h-fit bg-card p-6 md:sticky md:top-28">
        <h2 className="label mb-4 text-mute">Order summary</h2>
        <ul className="divide-y divide-ink/10">
          {lines.map((l) => {
            const a = byId(l.artworkId);
            if (!a) return null;
            return (
              <li key={l.key} className="flex gap-3 py-3">
                <div className="relative h-14 w-14 shrink-0 bg-white"><Art a={a} fill sizes="56px" className="object-cover" /></div>
                <div className="flex-1 text-sm"><p className="font-semibold uppercase leading-tight">{a.title}</p><p className="label text-mute">{l.option ?? 'Original'}{l.qty > 1 ? ` × ${l.qty}` : ''}</p></div>
                <span className="text-sm">{money(l.unitNPR * l.qty, currency)}</span>
              </li>
            );
          })}
        </ul>
        <dl className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(sub, currency)}</dd></div>
          <div className="flex justify-between"><dt>Shipping</dt><dd>{money(shipping.npr, currency)}</dd></div>
          <div className="flex justify-between border-t border-ink/10 pt-2 text-base font-semibold"><dt>Total</dt><dd>{money(total, currency)}</dd></div>
        </dl>
        <button type="submit" disabled={busy} className="btn mt-6 w-full disabled:opacity-50">{busy ? 'Processing…' : `Pay ${money(total, currency)}`}</button>
      </aside>
    </form>
  );
}
