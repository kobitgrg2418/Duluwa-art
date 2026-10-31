import { Suspense } from 'react';
import type { Metadata } from 'next';
import ShopClient from '@/components/sections/ShopClient';
import PageHead from '@/components/ui/PageHead';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Original Himalayan watercolors and limited-edition prints by Kobit Gurung. Signed, certified, shipped worldwide from Nepal.',
};

export default function ShopPage() {
  return (
    <>
      <PageHead eyebrow="Online gallery" title="Shop" intro="Original watercolors and signed prints. Each one painted in Nepal, packed by hand, shipped to your wall." />
      <Suspense fallback={<div className="page-pad min-h-[60vh]" />}>
        <ShopClient />
      </Suspense>
    </>
  );
}
