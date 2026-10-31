import { Suspense } from 'react';
import type { Metadata } from 'next';
import CommissionForm from '@/components/sections/CommissionForm';
import PageHead from '@/components/ui/PageHead';

export const metadata: Metadata = { title: 'Commission a painting', description: 'Commission an original Himalayan watercolor by Kobit Gurung: a portrait, a place, a mountain of your own.' };

export default function CommissionPage() {
  return (
    <>
      <PageHead eyebrow="Commission" title="Commission yours" intro="Tell me what you would like painted. I will reply within a day with a quote, a timeline and a sketch." />
      <Suspense fallback={<div className="min-h-[50vh]" />}><CommissionForm /></Suspense>
    </>
  );
}
