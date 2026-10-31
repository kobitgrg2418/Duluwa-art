import Reveal from '@/components/motion/Reveal';

export default function InfoTile({ label, value, sub, delay = 0 }: { label: string; value: string; sub?: string; delay?: number }) {
  return (
    <Reveal delay={delay} className="flex min-h-[180px] flex-col justify-between bg-panel p-5 text-white md:min-h-[210px]">
      <span className="label text-white/50">{label}</span>
      <div>
        <p className="font-display text-xl font-semibold leading-tight tracking-tight md:text-2xl">{value}</p>
        {sub && <p className="mt-2 text-[13px] text-white/50">{sub}</p>}
      </div>
    </Reveal>
  );
}
