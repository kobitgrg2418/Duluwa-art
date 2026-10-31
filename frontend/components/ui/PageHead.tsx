import SplitText from '@/components/motion/SplitText';
import Reveal from '@/components/motion/Reveal';

export default function PageHead({ eyebrow, title, intro, children }: { eyebrow?: string; title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <div className="page-pad pb-10 pt-32 md:pt-40">
      {eyebrow && <p className="label mb-4 text-mute">{eyebrow}</p>}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h1 className="display" aria-label={title}><SplitText text={title} by="word" as="span" className="block" /></h1>
        {children}
      </div>
      {intro && <Reveal delay={0.2}><p className="mt-6 max-w-[520px] text-[15px] text-ink/70 md:text-base">{intro}</p></Reveal>}
    </div>
  );
}
