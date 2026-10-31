'use client';
import { m } from 'framer-motion';
import { EASE, DUR } from '@/lib/motion';

interface Props extends React.ComponentProps<typeof m.div> {
  delay?: number;
  y?: number;
  as?: 'div' | 'section' | 'li' | 'p';
}

/** Fade + rise on enter. */
export default function Reveal({ children, delay = 0, y = 40, className, ...rest }: Props) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: DUR.reveal, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </m.div>
  );
}
