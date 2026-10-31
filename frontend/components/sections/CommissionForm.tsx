'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { m, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { bySlug } from '@/data/artworks';
import { EASE } from '@/lib/motion';
import { useStore } from '@/store/useStore';

const STEPS = ['Size', 'Subject', 'Reference', 'Budget', 'Contact'];
const SIZES = ['Small · 20 × 30 cm', 'Medium · 30 × 40 cm', 'Large · 40 × 60 cm', 'Not sure yet'];
const SUBJECTS = ['Portrait of a person', 'Mountain or landscape', 'Animal or bird', 'Something else'];
const BUDGETS = ['NPR 25,000 – 50,000', 'NPR 50,000 – 90,000', 'NPR 90,000 – 150,000', 'Talk to me first'];

function Choice({ options, value, onChange, label }: { options: string[]; value: string; onChange: (v: string) => void; label: string }) {
  return (
    <fieldset>
      <legend className="sr-only">{label}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <button key={o} type="button" aria-pressed={value === o} onClick={() => onChange(o)}
            className={clsx('border p-5 text-left font-display text-lg font-semibold uppercase tracking-tight transition-colors', value === o ? 'border-ink bg-ink text-white' : 'border-ink/20 hover:border-ink')}>
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function CommissionForm() {
  const sp = useSearchParams();
  const similar = sp.get('similar') ? bySlug(sp.get('similar')!) : undefined;
  const toast = useStore((s) => s.toast);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [f, setF] = useState({ size: '', subject: similar ? 'Something else' : '', notes: similar ? `Something similar to “${similar.title}”.` : '', budget: '', name: '', email: '', phone: '' });
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const set = (p: Partial<typeof f>) => setF((x) => ({ ...x, ...p }));

  const valid = [!!f.size, !!f.subject, true, !!f.budget, f.name.trim().length > 1 && /\S+@\S+\.\S+/.test(f.email)][step];
  const go = (n: number) => { setDir(n > step ? 1 : -1); setStep(n); };

  const submit = async () => {
    setSending(true);
    // INTEGRATION STUB: POST `f` and the uploaded files to your inbox / CRM / Formspree / Resend.
    await new Promise((r) => setTimeout(r, 1000));
    setSending(false);
    setDone(true);
    toast('Commission request sent');
  };

  const onFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles((cur) => [...cur, ...Array.from(list).slice(0, 4).map((file) => ({ name: file.name, url: URL.createObjectURL(file) }))].slice(0, 4));
  };

  if (done) {
    return (
      <div className="page-pad pb-32 text-center">
        <m.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE }} className="font-serif text-4xl italic md:text-6xl">Thank you, {f.name.split(' ')[0]}.</m.p>
        <p className="mx-auto mt-4 max-w-[420px] text-ink/70">Your request is with Kobit. Expect a reply at {f.email} within a day.</p>
      </div>
    );
  }

  return (
    <section className="page-pad pb-28">
      <div className="mb-8">
        <div className="mb-2 flex justify-between">
          {STEPS.map((s, i) => <span key={s} className={clsx('label', i <= step ? 'text-ink' : 'text-mute')}>{i + 1}. {s}</span>)}
        </div>
        <div className="h-px bg-ink/15"><m.div className="h-full origin-left bg-accent" animate={{ scaleX: (step + 1) / STEPS.length }} transition={{ duration: 0.7, ease: EASE }} /></div>
      </div>

      <div className="min-h-[340px] max-w-[860px]">
        <AnimatePresence mode="wait" custom={dir}>
          <m.div key={step} custom={dir}
            initial={{ opacity: 0, x: 60 * dir }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 * dir }} transition={{ duration: 0.5, ease: EASE }}>
            {step === 0 && <><h2 className="display-md mb-6">How big?</h2><Choice label="Size" options={SIZES} value={f.size} onChange={(v) => set({ size: v })} /></>}
            {step === 1 && (
              <><h2 className="display-md mb-6">What should I paint?</h2>
                <Choice label="Subject" options={SUBJECTS} value={f.subject} onChange={(v) => set({ subject: v })} />
                <label htmlFor="notes" className="label mt-6 block text-mute">Tell me more</label>
                <textarea id="notes" rows={4} value={f.notes} onChange={(e) => set({ notes: e.target.value })} className="mt-2 w-full border border-ink/20 bg-transparent p-3 outline-none focus:border-ink" /></>
            )}
            {step === 2 && (
              <><h2 className="display-md mb-6">Any references?</h2>
                <label htmlFor="ref" className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-ink/30 p-10 text-center hover:border-ink">
                  <span className="font-display text-lg font-semibold uppercase">Add up to 4 photos</span>
                  <span className="label mt-1 text-mute">JPG or PNG · optional</span>
                  <input id="ref" type="file" accept="image/*" multiple className="sr-only" onChange={(e) => onFiles(e.target.files)} />
                </label>
                {files.length > 0 && (
                  <ul className="mt-4 flex gap-2">
                    {files.map((x) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <li key={x.url}><img src={x.url} alt={x.name} className="h-24 w-24 object-cover" /></li>
                    ))}
                  </ul>
                )}</>
            )}
            {step === 3 && <><h2 className="display-md mb-6">Your budget</h2><Choice label="Budget" options={BUDGETS} value={f.budget} onChange={(v) => set({ budget: v })} /></>}
            {step === 4 && (
              <><h2 className="display-md mb-6">Where do I reply?</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {([['name', 'Your name', 'text'], ['email', 'Email', 'email'], ['phone', 'WhatsApp (optional)', 'tel']] as const).map(([k, l, t]) => (
                    <div key={k} className={k === 'phone' ? 'sm:col-span-2' : ''}>
                      <label htmlFor={k} className="label text-mute">{l}</label>
                      <input id={k} type={t} value={f[k]} onChange={(e) => set({ [k]: e.target.value } as Partial<typeof f>)} className="mt-1 w-full border-b border-ink/30 bg-transparent py-2 outline-none focus:border-ink" />
                    </div>
                  ))}
                </div></>
            )}
          </m.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex gap-3">
        {step > 0 && <button type="button" onClick={() => go(step - 1)} className="btn btn-ghost">Back</button>}
        {step < STEPS.length - 1 ? (
          <button type="button" disabled={!valid} onClick={() => go(step + 1)} className="btn disabled:opacity-30">Continue</button>
        ) : (
          <button type="button" disabled={!valid || sending} onClick={submit} className="btn disabled:opacity-30">{sending ? 'Sending…' : 'Send request'}</button>
        )}
      </div>
    </section>
  );
}
