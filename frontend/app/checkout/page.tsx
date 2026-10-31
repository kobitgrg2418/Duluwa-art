import type { Metadata } from 'next';
import PageHead from '@/components/ui/PageHead';
import CheckoutView from '@/components/sections/CheckoutView';

export const metadata: Metadata = { title: 'Checkout', robots: { index: false } };

export default function CheckoutPage() {
  return (<><PageHead title="Checkout" /><CheckoutView /></>);
}
