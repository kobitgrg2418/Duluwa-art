'use client';
import { m, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { EASE } from '@/lib/motion';

export default function ToastHost() {
  const toasts = useStore((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[140] flex flex-col items-center gap-2 px-4" role="status" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <m.div key={t.id} layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.5, ease: EASE }}
            className="bg-ink px-4 py-3 text-[13px] text-white shadow-matDeep">
            {t.msg}
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
