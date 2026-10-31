import type { Collection } from '@/lib/types';

export const collections: Collection[] = [
  { slug: 'himalayan-faces', title: 'Himalayan Faces', blurb: 'Elders, children, ceremony.', intro: 'Faces that have carried weather, work and festival. Painted slowly, in layers of grey and warm earth.', cover: 'ceremonial-headdress' },
  { slug: 'mountain-paths', title: 'Mountain Paths', blurb: 'Porters, villages, yaks and peaks.', intro: 'Trails, caravans and hill houses under the fishtail peak. Every path leads somewhere high.', cover: 'yak-caravan' },
  { slug: 'wild-and-small', title: 'Wild & Small', blurb: 'Sparrows, bison, small companions.', intro: 'The quiet lives at the edges of the frame: birds, beasts and the soft animals of home.', cover: 'bison' },
  { slug: 'portraits-of-youth', title: 'Portraits of Youth', blurb: 'Young faces, direct looks.', intro: 'Musicians and thinkers, caught between a question and an answer.', cover: 'young-woman-earrings' },
];

export const collectionBySlug = (s: string) => collections.find((c) => c.slug === s);
