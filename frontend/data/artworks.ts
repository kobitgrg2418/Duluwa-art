import type { Artwork, ArtType, Category, SeriesSlug, Status } from '@/lib/types';
import manifest from './images.generated.json';

const MEDIUM = 'Watercolor on cotton paper';
const NPR_PER_USD = 133;

interface Raw {
  id: string;
  title: string;
  series: SeriesSlug;
  category: Category;
  w: number;
  h: number;
  year: number;
  type: ArtType;
  npr: number;
  status?: Status;
  oneOfOne?: boolean;
  justPainted?: boolean;
  description: string;
  tags: string[];
}

// Titles, sizes and prices are placeholders — edit freely.
const RAW: Raw[] = [
  { id: 'porter-misty-forest', title: 'Porter in the Mist', series: 'mountain-paths', category: 'landscape', w: 40, h: 30, year: 2024, type: 'original', npr: 48000, description: 'A porter and his doko disappear into a forest that breathes fog. The path is long; the load is light only in the painting.', tags: ['forest', 'porter', 'mist'] },
  { id: 'child-with-bowl', title: 'The Warm Bowl', series: 'himalayan-faces', category: 'portrait', w: 30, h: 40, year: 2024, type: 'original', npr: 62000, description: 'A child drinks from a bowl held in both hands. Blue wool, grey wash, and one bright, unguarded eye.', tags: ['child', 'portrait'] },
  { id: 'two-sparrows', title: 'Two Sparrows, Wet Ink', series: 'wild-and-small', category: 'wildlife', w: 40, h: 30, year: 2023, type: 'print', npr: 4500, description: 'Two sparrows on a bare branch, the paper spattered with rain and ink.', tags: ['sparrow', 'birds', 'ink'] },
  { id: 'guitarist', title: 'The Guitarist', series: 'portraits-of-youth', category: 'portrait', w: 30, h: 40, year: 2023, type: 'print', npr: 5500, description: 'A guitarist emerging from a storm of grey wash, the strings caught in white paper.', tags: ['music', 'grey wash'] },
  { id: 'village-machhapuchhre', title: 'Village under Machhapuchhre', series: 'mountain-paths', category: 'landscape', w: 40, h: 30, year: 2023, type: 'original', npr: 85000, description: 'A hill house, a haystack, and the fishtail peak watching over both.', tags: ['village', 'machhapuchhre', 'mountain'] },
  { id: 'ceremonial-headdress', title: 'The Headdress', series: 'himalayan-faces', category: 'portrait', w: 30, h: 45, year: 2026, type: 'original', npr: 110000, oneOfOne: true, description: 'A child in ceremonial gold and beads, eyes lowered. Quiet before the festival begins.', tags: ['child', 'ceremony', 'gold'] },
  { id: 'guinea-pigs', title: 'Two Guinea Pigs', series: 'wild-and-small', category: 'wildlife', w: 40, h: 30, year: 2026, type: 'print', npr: 3500, description: 'Soft shapes, soft edges. Two small companions dissolving into a cloud of wash.', tags: ['animals', 'soft'] },
  { id: 'elder-smoke', title: 'Smoke Breath', series: 'himalayan-faces', category: 'portrait', w: 30, h: 45, year: 2026, type: 'original', npr: 72000, status: 'sold', description: 'An elder in a dhaka topi exhales smoke into cold air. The original has found its home.', tags: ['elder', 'dhaka topi'] },
  { id: 'bearded-elder', title: 'The Bearded Elder', series: 'himalayan-faces', category: 'portrait', w: 40, h: 32, year: 2026, type: 'original', npr: 68000, description: 'A weathered face under a soft hat, every year of wind held in the beard.', tags: ['elder', 'beard'] },
  { id: 'yak-caravan', title: 'Yak Caravan on Snow', series: 'mountain-paths', category: 'landscape', w: 40, h: 29, year: 2026, type: 'original', npr: 95000, description: 'A caravan of yaks crosses a snowfield beneath giant peaks. Cold light, slow steps.', tags: ['yak', 'snow', 'caravan'] },
  { id: 'elder-lighting-up', title: 'Lighting Up', series: 'himalayan-faces', category: 'portrait', w: 40, h: 36, year: 2026, type: 'original', npr: 78000, description: 'A patterned topi, closed eyes, and a small flame cupped in worn hands.', tags: ['elder', 'dhaka topi', 'hands'] },
  { id: 'meadow-travellers', title: 'Towards the Fishtail', series: 'mountain-paths', category: 'landscape', w: 40, h: 33, year: 2026, type: 'original', npr: 88000, justPainted: true, description: 'Travellers cross an autumn meadow toward Machhapuchhre, tiny against the ridge.', tags: ['travellers', 'machhapuchhre', 'meadow'] },
  { id: 'blue-blossom-sparrows', title: 'Sparrows in Blue Blossom', series: 'wild-and-small', category: 'wildlife', w: 40, h: 35, year: 2026, type: 'original', npr: 52000, status: 'sold', description: 'Three sparrows huddle close among blue blossoms. Warmth made of feathers.', tags: ['sparrow', 'blossom'] },
  { id: 'mountain-hut', title: 'Hut and Stone Steps', series: 'mountain-paths', category: 'landscape', w: 40, h: 29, year: 2026, type: 'print', npr: 5000, description: 'A tin-roofed hut at the end of a stone path, the valley opening behind it.', tags: ['hut', 'valley', 'steps'] },
  { id: 'bison', title: 'Bison', series: 'wild-and-small', category: 'wildlife', w: 30, h: 43, year: 2026, type: 'print', npr: 6500, description: 'A bison head rising from sepia wash, horns sharp against a pale sky.', tags: ['bison', 'horns'] },
  { id: 'young-woman-clasped', title: 'Hands at the Collar', series: 'portraits-of-youth', category: 'portrait', w: 30, h: 49, year: 2026, type: 'original', npr: 74000, justPainted: true, description: 'A young woman, hands clasped at her collar, a direct look and a dark, deep ground.', tags: ['young woman', 'portrait'] },
  { id: 'young-woman-earrings', title: 'Red Earrings', series: 'portraits-of-youth', category: 'portrait', w: 40, h: 37, year: 2026, type: 'original', npr: 82000, justPainted: true, description: 'Hair across her face and heavy earrings. She looks away, thinking about something far.', tags: ['young woman', 'earrings'] },
  { id: 'elder-smoke-variant', title: 'Smoke Breath II', series: 'himalayan-faces', category: 'portrait', w: 30, h: 48, year: 2026, type: 'print', npr: 7500, description: 'A second pass at the elder’s breath on the cold air, offered as a signed print.', tags: ['elder', 'print'] },
];

type Manifest = Record<string, { width: number; height: number; aspect: number; blur: string }>;
const M = manifest as Manifest;

export const artworks: Artwork[] = RAW.map((r) => {
  const m = M[r.id];
  return {
    id: r.id,
    slug: r.id,
    title: r.title,
    series: r.series,
    category: r.category,
    orientation: m.aspect >= 1 ? 'landscape' : 'portrait',
    widthCm: r.w,
    heightCm: r.h,
    year: r.year,
    medium: MEDIUM,
    type: r.type,
    priceNPR: r.npr,
    priceUSD: Math.round(r.npr / NPR_PER_USD),
    status: r.status ?? 'available',
    oneOfOne: !!r.oneOfOne,
    justPainted: !!r.justPainted,
    image: r.id,
    width: m.width,
    height: m.height,
    aspect: m.aspect,
    blurDataURL: m.blur,
    description: r.description,
    tags: r.tags,
  };
});

export const bySlug = (slug: string) => artworks.find((a) => a.slug === slug);
export const byId = (id: string) => artworks.find((a) => a.id === id);
export const NPR_USD = NPR_PER_USD;

export const availableOriginals = artworks.filter((a) => a.type === 'original' && a.status === 'available');
export const prints = artworks.filter((a) => a.type === 'print');
export const justPainted = artworks.filter((a) => a.justPainted);
