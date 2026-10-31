import type { MetadataRoute } from 'next';
import { artworks } from '@/data/artworks';
import { collections } from '@/data/collections';
import { posts } from '@/data/journal';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://duluwa.art';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const fixed = ['', '/shop', '/collections', '/artist', '/commission', '/journal'];
  return [
    ...fixed.map((p) => ({ url: SITE + p, lastModified: now })),
    ...artworks.map((a) => ({ url: `${SITE}/artwork/${a.slug}`, lastModified: now })),
    ...collections.map((c) => ({ url: `${SITE}/collections/${c.slug}`, lastModified: now })),
    ...posts.map((p) => ({ url: `${SITE}/journal/${p.slug}`, lastModified: new Date(p.date) })),
  ];
}
