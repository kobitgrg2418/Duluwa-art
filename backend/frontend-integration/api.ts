// Drop into duluwa-art/lib/api.ts.  Set NEXT_PUBLIC_API_URL=http://localhost:8000 in the frontend's .env.local
export const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

async function get<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(`${API}/api${path}`, { next: { revalidate: 60 }, ...init }); // refresh content every minute
  if (!r.ok) throw new Error(`${path}: ${r.status}`);
  return r.json();
}

export interface Art {
  id: string; slug: string; title: string; series: string; series_title: string; category: 'portrait' | 'landscape' | 'wildlife';
  orientation: 'portrait' | 'landscape'; width_cm: number; height_cm: number; year: number; medium: string; type: 'original' | 'print';
  price_npr: number; price_usd: number; status: 'available' | 'sold'; one_of_one: boolean; just_painted: boolean;
  image: string; renditions: { '480': string; '960': string; '1600': string }; width: number; height: number; aspect: number;
  blur_data_url: string; description: string; tags: string[];
}
export interface Page<T> { count: number; next: string | null; previous: string | null; results: T[] }

export const getSite = () => get<Record<string, unknown>>('/site/');
export const getHome = () => get<Record<string, unknown>>('/home/');
export const getArtist = () => get<Record<string, unknown>>('/artist/');
export const getShopConfig = () => get<Record<string, unknown>>('/shop-config/');
export const getCollections = () => get<Record<string, unknown>[]>('/collections/');
export const getCollection = (slug: string) => get<Record<string, unknown>>(`/collections/${slug}/`);
export const getArtworks = (qs = '') => get<Page<Art>>(`/artworks/${qs ? `?${qs}` : ''}`);   // e.g. 'type=print&series=mountain-paths&ordering=price_npr'
export const getArtwork = (slug: string) => get<Art & { related: Art[]; gallery: { image: string; caption: string }[] }>(`/artworks/${slug}/`);
export const getJournal = () => get<Page<Record<string, unknown>>>('/journal/');

const post = (path: string, body: unknown) =>
  fetch(`${API}/api${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

export const subscribe = (email: string) => post('/newsletter/', { email });
export const sendContact = (b: { name: string; email: string; message: string }) => post('/contact/', b);
export const createOrder = (b: unknown) => post('/orders/', b); // prices are recomputed on the server
export const sendCommission = (form: FormData) => fetch(`${API}/api/commissions/`, { method: 'POST', body: form }); // multipart: fields + references[]
