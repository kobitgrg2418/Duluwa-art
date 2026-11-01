'use client';
import Link from 'next/link';
import { m } from 'framer-motion';
import { EASE } from '@/lib/motion';
import type { CTAPanelAPI } from '@/lib/api-types';

export default function SplitCTA({ ctaPanels }: { ctaPanels: CTAPanelAPI[] }) {
  return (
    <section className="grid bg-night text-white md:grid-cols-2" aria-label="Get a print or commission">
      {ctaPanels.map((p, i) => (
        <m.div
          key={p.title}
          style={{ backgroundColor: p.background }}
          className="flex min-h-[60vh] flex-col items-center justify-center gap-8 px-[var(--pad)] py-20 text-center transition-[filter] duration-700 hover:brightness-150 md:min-h-[72vh]"
          initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-12%' }}
          transition={{ duration: 1, ease: EASE, delay: i * 0.15 }}
        >
          <h2 className="display-md !text-[clamp(2.5rem,6vw,6rem)]">{p.title}</h2>
          <p className="max-w-[300px] text-[14px] text-white/50">{p.note}</p>
          <Link href={p.href} className="btn btn-light">{p.button_label}</Link>
        </m.div>
      ))}
    </section>
  );
}
