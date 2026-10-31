'use client';
import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { EASE } from '@/lib/motion';

export default function Accordion({ items }: { items: { title: string; body: React.ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-t border-ink/10">
      {items.map((it, i) => (
        <div key={it.title} className="border-b border-ink/10">
          <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between py-4 text-left">
            <span className="label">{it.title}</span>
            <m.span animate={{ rotate: open === i ? 45 : 0 }} className="text-lg leading-none">+</m.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <m.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} className="overflow-hidden">
                <div className="pb-5 text-[14px] leading-relaxed text-ink/70">{it.body}</div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
