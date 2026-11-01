import Hero from '@/components/sections/Hero';
import ShopSection from '@/components/sections/ShopSection';
import CommissionDark from '@/components/sections/CommissionDark';
import Series from '@/components/sections/Series';
import SplitCTA from '@/components/sections/SplitCTA';
import Quote from '@/components/sections/Quote';
import Footer from '@/components/sections/Footer';
import { getHome } from '@/lib/api';
import type { HomeAPI } from '@/lib/api-types';

// Fallback data for build time when API is unavailable
const FALLBACK_HOME: HomeAPI = {
  hero: {
    lines: ['Duluwa Art showcases', 'Himalayan life in', 'water, pigment', 'and light'],
    scroll_hint: 'Scroll',
    tagline: 'Watercolors from the Himalaya — painted in Nepal, shipped to your wall.',
    finale_artwork: 'yak-caravan',
    layers: [
      { artwork: 'child-with-bowl', left_vw: 6, width_vw: 19, start_vh: 52, speed: 1.0, show_on_mobile: true },
      { artwork: 'village-machhapuchhre', left_vw: 62, width_vw: 27, start_vh: 88, speed: 1.4, show_on_mobile: true },
      { artwork: 'bearded-elder', left_vw: 33, width_vw: 22, start_vh: 120, speed: 0.7, show_on_mobile: false },
      { artwork: 'ceremonial-headdress', left_vw: 25, width_vw: 15, start_vh: 150, speed: 1.1, show_on_mobile: true },
      { artwork: 'two-sparrows', left_vw: 3, width_vw: 25, start_vh: 175, speed: 1.6, show_on_mobile: false },
      { artwork: 'bison', left_vw: 42, width_vw: 16, start_vh: 200, speed: 0.9, show_on_mobile: true },
      { artwork: 'mountain-hut', left_vw: 16, width_vw: 26, start_vh: 228, speed: 1.25, show_on_mobile: false },
      { artwork: 'young-woman-clasped', left_vw: 60, width_vw: 14, start_vh: 255, speed: 0.8, show_on_mobile: true },
    ],
  },
  shop: {
    title: ['The', 'Collection'],
    originals: { label: 'Available originals', count: 0, items: [] },
    prints: { label: 'Prints & limited editions', count: 0, items: [] },
    just_painted: { label: 'Just painted', count: 0, items: [] },
  },
  care: {
    heading: 'Commission & Care',
    text: 'Every painting is signed, certified and shipped in archival packaging. Want something made for a specific wall or a specific face? Commission it.',
    primary: { label: 'Commission a painting', href: '/commission' },
    secondary: { label: 'Contact the artist', href: 'mailto:hello@duluwa.art' },
    tiles: [
      { label: 'Shipping', value: 'Worldwide, tracked', sub: 'Framed or rolled, fully insured.' },
      { label: 'Payment', value: 'eSewa · Khalti · Card', sub: 'Or bank transfer.' },
      { label: 'Authenticity', value: 'Signed original + certificate', sub: 'Each piece is 1 of 1.' },
      { label: 'WhatsApp / Email', value: 'hello@duluwa.art', sub: 'Replies within a day.' },
    ],
    tall_artwork: 'young-woman-clasped',
    wide_artwork: 'village-machhapuchhre',
  },
  series: {
    heading: 'Series',
    items: [
      { slug: 'himalayan-faces', title: 'Himalayan Faces', blurb: 'Elders, children, ceremony.', intro: 'Faces that have carried weather, work and festival. Painted slowly, in layers of grey and warm earth.', artwork_count: 6, cover: null, order: 1 },
      { slug: 'mountain-paths', title: 'Mountain Paths', blurb: 'Porters, villages, yaks and peaks.', intro: 'Trails, caravans and hill houses under the fishtail peak. Every path leads somewhere high.', artwork_count: 5, cover: null, order: 2 },
      { slug: 'wild-and-small', title: 'Wild & Small', blurb: 'Sparrows, bison, small companions.', intro: 'The quiet lives at the edges of the frame: birds, beasts and the soft animals of home.', artwork_count: 4, cover: null, order: 3 },
      { slug: 'portraits-of-youth', title: 'Portraits of Youth', blurb: 'Young faces, direct looks.', intro: 'Musicians and thinkers, caught between a question and an answer.', artwork_count: 3, cover: null, order: 4 },
    ],
  },
  cta_panels: [
    { title: 'Get a print', note: 'Archival paper, signed & numbered.', button_label: 'Shop prints', href: '/shop?type=print', background: '#111111' },
    { title: 'Commission yours', note: 'A face, a path, a mountain of your own.', button_label: 'Start a commission', href: '/commission', background: '#0b0b0b' },
  ],
  quote: {
    text: 'Every brushstroke carries a face, a path, a mountain of home.',
    author: 'Kobit Gurung',
    artwork: 'yak-caravan',
  },
  footer_fan: ['ceremonial-headdress', 'yak-caravan', 'young-woman-earrings'],
};

export default async function Home() {
  // Fetch from API, fallback to local data if API fails
  const data = await getHome();
  const homeData = data || FALLBACK_HOME;

  return (
    <>
      <Hero hero={homeData.hero} />
      <ShopSection shop={homeData.shop} />
      <CommissionDark care={homeData.care} />
      <Series series={homeData.series} />
      <SplitCTA ctaPanels={homeData.cta_panels} />
      <Quote quote={homeData.quote} />
      <Footer footerFan={homeData.footer_fan} />
    </>
  );
}
