import type { Artwork } from './types';

export const PRINT_SIZES = [
  { label: 'A4 · 21 × 30 cm', mult: 1 },
  { label: 'A3 · 30 × 42 cm', mult: 1.7 },
  { label: 'A2 · 42 × 59 cm', mult: 2.8 },
];
export const PRINT_PAPERS = [
  { label: 'Matte cotton', add: 0 },
  { label: 'Archival rag', add: 1500 },
];

export const printPrice = (a: Artwork, size: number, paper: number) =>
  Math.round((a.priceNPR * PRINT_SIZES[size].mult + PRINT_PAPERS[paper].add) / 100) * 100;

export const printOption = (size: number, paper: number) =>
  `${PRINT_SIZES[size].label} · ${PRINT_PAPERS[paper].label}`;

export const SHIPPING = [
  { id: 'standard', label: 'Tracked standard', days: '10–16 days', npr: 2500 },
  { id: 'express', label: 'Express courier', days: '4–7 days', npr: 6500 },
];
