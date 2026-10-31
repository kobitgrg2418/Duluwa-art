import { NPR_USD } from '@/data/artworks';
import type { Currency } from '@/store/useStore';

export const money = (npr: number, c: Currency) =>
  c === 'NPR' ? 'NPR ' + npr.toLocaleString('en-US') : '$' + Math.round(npr / NPR_USD).toLocaleString('en-US');
