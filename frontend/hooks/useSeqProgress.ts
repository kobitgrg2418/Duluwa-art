'use client';
import { useRef, type RefObject } from 'react';
import { useScroll, useSpring, useReducedMotion, type MotionValue } from 'framer-motion';
import { SPRING_SCROLL } from '@/lib/motion';

type Offset = NonNullable<Parameters<typeof useScroll>[0]>['offset'];

/** One shared, spring-smoothed scroll progress (0–1) for a tall sequence wrapper. */
export function useSeqProgress<T extends HTMLElement>(
  offset: Offset = ['start start', 'end end'],
): { ref: RefObject<T>; progress: MotionValue<number>; reduced: boolean } {
  const ref = useRef<T>(null);
  const reduced = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const progress = useSpring(scrollYProgress, reduced ? { stiffness: 1000, damping: 100 } : SPRING_SCROLL);
  return { ref: ref as RefObject<T>, progress, reduced };
}
