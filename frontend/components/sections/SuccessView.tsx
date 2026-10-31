'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { m } from 'framer-motion';
import { EASE } from '@/lib/motion';

export default function SuccessView() {
  const sp = useSearchParams();
  const order = sp.get('order') ?? 'DA-000000';
  const pending = sp.get('status') === 'awaiting_payment';
  return (
    <section className="page-pad flex min-h-[90vh] flex-col items-center justify-center pb-20 pt-32 text-center">
      <svg viewBox="0 0 120 120" className="h-28 w-28" aria-hidden>
        {/* paint drop that settles into a check */}
        <m.path d="M60 8 C60 8 98 52 98 76 C98 98 80 112 60 112 C40 112 22 98 22 76 C22 52 60 8 60 8 Z" fill="var(--accent)"
          initial={{ scale: 0, y: -60, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} transition={{ duration: 0.9, ease: EASE }} style={{ transformOrigin: '60px 76px' }} />
        <m.path d="M40 78 L55 93 L84 60" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 0.7, ease: EASE }} />
      </svg>
      <m.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.9, ease: EASE }} className="display-md mt-8">
        {pending ? 'Order received' : 'Order confirmed'}
      </m.h1>
      <m.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-4 max-w-[440px] text-ink/70">
        Order <strong>{order}</strong>. {pending ? 'Bank details are on their way by email; your painting is reserved for 3 days.' : 'A confirmation and tracking details will follow by email.'} Thank you for taking a piece of the Himalaya home.
      </m.p>
      <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="mt-8 flex gap-3">
        <Link href="/shop" className="btn">Keep browsing</Link>
        <Link href="/" className="btn btn-ghost">Home</Link>
      </m.div>
    </section>
  );
}
