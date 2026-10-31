import { Suspense } from 'react';
import type { Metadata } from 'next';
import SuccessView from '@/components/sections/SuccessView';

export const metadata: Metadata = { title: 'Order confirmed', robots: { index: false } };

export default function SuccessPage() {
  return <Suspense fallback={null}><SuccessView /></Suspense>;
}
