import type { Metadata } from 'next';
import PageHead from '@/components/ui/PageHead';
import CartView from '@/components/sections/CartView';

export const metadata: Metadata = { title: 'Cart', robots: { index: false } };

export default function CartPage() {
  return (<><PageHead title="Cart" /><CartView /></>);
}
