// Raw API types from Django REST backend (snake_case)

export interface ArtworkAPI {
  id: string; // = slug
  slug: string;
  title: string;
  series: string; // slug
  series_title: string;
  category: string;
  orientation: 'landscape' | 'portrait';
  width_cm: number;
  height_cm: number;
  year: number;
  medium: string;
  type: 'original' | 'print';
  price_npr: number;
  price_usd: number;
  status: 'available' | 'sold';
  one_of_one: boolean;
  just_painted: boolean;
  image: string; // full URL
  renditions: {
    '480': string;
    '960': string;
    '1600': string;
  };
  width: number;
  height: number;
  aspect: number;
  blur_data_url: string;
  description: string;
  tags: string[];
  gallery?: string[]; // only on detail endpoint
  related?: string[]; // only on detail endpoint (slugs)
}

export interface CollectionAPI {
  slug: string;
  title: string;
  blurb: string;
  intro: string;
  artwork_count: number;
  cover: ArtworkAPI | null;
  order: number;
}

export interface JournalPostAPI {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  published_at: string;
  cover_image: string;
}

export interface SiteSettingsAPI {
  wordmark: string;
  tagline: string;
  header_ships_from_label: string;
  header_ships_from_value: string;
  header_shipping_label: string;
  header_shipping_value: string;
  contact_email: string;
  whatsapp_number: string;
  instagram_url: string;
  facebook_url: string;
  studio_location: string;
  copyright_text: string;
  newsletter_placeholder: string;
  newsletter_thanks: string;
  npr_per_usd: number;
  seo_title: string;
  seo_description: string;
  announcement?: string;
}

export interface MenuLinkAPI {
  label: string;
  href: string;
  placement: 'menu' | 'footer';
  order: number;
}

export interface MarqueeItemAPI {
  text: string;
}

export interface SiteAPI {
  settings: SiteSettingsAPI;
  menu_links: MenuLinkAPI[];
  marquee: MarqueeItemAPI[];
}

export interface PrintSizeAPI {
  label: string;
  multiplier: number;
}

export interface PrintPaperAPI {
  label: string;
  add_npr: number;
}

export interface ShippingMethodAPI {
  key: string;
  label: string;
  days: string;
  price_npr: number;
}

export interface ShopConfigAPI {
  print_sizes: PrintSizeAPI[];
  print_papers: PrintPaperAPI[];
  shipping_methods: ShippingMethodAPI[];
  npr_per_usd: number;
}

export interface HeroLayerAPI {
  artwork: string; // slug
  left_vw: number;
  width_vw: number;
  start_vh: number;
  speed: number;
  show_on_mobile: boolean;
}

export interface HeroAPI {
  lines: string[];
  scroll_hint: string;
  tagline: string;
  finale_artwork: string; // slug
  layers: HeroLayerAPI[];
}

export interface ShopSectionAPI {
  title: [string, string];
  originals: { label: string; count: number; items: string[] };
  prints: { label: string; count: number; items: string[] };
  just_painted: { label: string; count: number; items: string[] };
}

export interface CareTileAPI {
  label: string;
  value: string;
  sub: string;
}

export interface CareAPI {
  heading: string;
  text: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  tiles: CareTileAPI[];
  tall_artwork: string; // slug
  wide_artwork: string; // slug
}

export interface SeriesAPI {
  heading: string;
  items: CollectionAPI[];
}

export interface CTAPanelAPI {
  title: string;
  note: string;
  button_label: string;
  href: string;
  background: string;
}

export interface QuoteAPI {
  text: string;
  author: string;
  artwork: string; // slug
}

export interface HomeAPI {
  hero: HeroAPI;
  shop: ShopSectionAPI;
  care: CareAPI;
  series: SeriesAPI;
  cta_panels: CTAPanelAPI[];
  quote: QuoteAPI;
  footer_fan: string[]; // artwork slugs
}

export interface ArtistAPI {
  name: string;
  headline: string;
  paragraphs: string[];
  photo: string;
  portrait_artwork: string; // slug
  process_title: string;
  process_artwork: string; // slug
  stages: Array<{
    title: string;
    description: string;
    image: string;
  }>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface OrderItemAPI {
  artwork: string; // slug
  qty: number;
  size_index?: number;
  paper_index?: number;
}

export interface OrderAPI {
  name: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  city: string;
  zip_code: string;
  payment_method: 'esewa' | 'khalti' | 'card' | 'bank';
  shipping_method: string; // key
  items: OrderItemAPI[];
}

export interface OrderResponseAPI {
  order_id: string;
  status: string;
  subtotal_npr: number;
  shipping_npr: number;
  total_npr: number;
  items: OrderItemAPI[];
}

export interface CommissionAPI {
  name: string;
  email: string;
  phone: string;
  size: string;
  subject: string;
  notes: string;
  budget: string;
  similar?: string; // slug
  references?: File[];
}

export interface NewsletterAPI {
  email: string;
}

export interface ContactAPI {
  name: string;
  email: string;
  message: string;
}

export interface SuccessResponseAPI {
  ok: boolean;
  message: string;
}

export interface ValidationErrorAPI {
  [key: string]: string[];
}
