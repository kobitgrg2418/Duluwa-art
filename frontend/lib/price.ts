import { useCatalog } from '@/context/CatalogContext';
import type { Currency } from '@/store/useStore';

export const money = (npr: number, c: Currency, nprPerUsd?: number) => {
  const rate = nprPerUsd || 133;
  return c === 'NPR' ? 'NPR ' + npr.toLocaleString('en-US') : '$' + Math.round(npr / rate).toLocaleString('en-US');
};
