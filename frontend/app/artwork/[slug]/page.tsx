import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { artworks, bySlug } from '@/data/artworks';
import ArtworkView from '@/components/sections/ArtworkView';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://duluwa.art';

export function generateStaticParams() {
  return artworks.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = bySlug((await params).slug);
  if (!a) return {};
  const img = `/artworks/${a.image}-1600.webp`;
  return {
    title: a.title,
    description: `${a.title} — ${a.medium.toLowerCase()}, ${a.widthCm} × ${a.heightCm} cm, by Kobit Gurung. ${a.description}`,
    openGraph: { title: `${a.title} — Duluwa Art`, description: a.description, images: [{ url: img, width: 1600 }] },
    alternates: { canonical: `/artwork/${a.slug}` },
  };
}

export default async function ArtworkPage({ params }: { params: Promise<{ slug: string }> }) {
  const a = bySlug((await params).slug);
  if (!a) notFound();
  const related = [...artworks.filter((x) => x.id !== a.id && x.series === a.series), ...artworks.filter((x) => x.id !== a.id && x.series !== a.series)].slice(0, 8);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: a.title,
    image: `${SITE}/artworks/${a.image}-1600.webp`,
    description: a.description,
    sku: a.id,
    brand: { '@type': 'Brand', name: 'Duluwa Art' },
    creator: { '@type': 'Person', name: 'Kobit Gurung' },
    offers: {
      '@type': 'Offer',
      url: `${SITE}/artwork/${a.slug}`,
      priceCurrency: 'NPR',
      price: a.priceNPR,
      availability: a.status === 'sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
    },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArtworkView a={a} related={related} />
    </>
  );
}
