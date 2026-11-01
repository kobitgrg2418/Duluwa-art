import type {
  ArtworkAPI,
  CollectionAPI,
  JournalPostAPI,
  SiteAPI,
  ShopConfigAPI,
  HomeAPI,
  ArtistAPI,
  PaginatedResponse,
  OrderAPI,
  OrderResponseAPI,
  CommissionAPI,
  NewsletterAPI,
  ContactAPI,
  SuccessResponseAPI,
  ValidationErrorAPI,
} from './api-types';
import type { Artwork, Collection, CartLine } from './types';
import manifest from '../data/images.generated.json';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function get<T>(path: string, options?: RequestInit): Promise<T | null> {
  const url = `${API_URL}/api${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    next: { revalidate: 60 },
    ...options?.next,
  }).catch((error) => {
    console.error(`API connection error for ${path}:`, error);
    return null;
  });

  if (!res.ok) {
    console.error(`API error ${res.status} for ${path}`);
    return null;
  }

  try {
    return await res.json();
  } catch (error) {
    console.error(`Failed to parse JSON from ${path}:`, error);
    return null;
  }
}

async function post<T>(path: string, data: unknown, options?: RequestInit): Promise<T> {
  const url = `${API_URL}/api${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: JSON.stringify(data),
    ...options,
  });

  if (!res.ok) {
    const errorData: ValidationErrorAPI | { detail: string } = await res.json().catch(() => ({ detail: res.statusText }));
    throw errorData;
  }

  return res.json();
}

async function postFormData<T>(path: string, formData: FormData, options?: RequestInit): Promise<T> {
  const url = `${API_URL}/api${path}`;
  const res = await fetch(url, {
    method: 'POST',
    body: formData,
    ...options,
  });

  if (!res.ok) {
    const errorData: ValidationErrorAPI | { detail: string } = await res.json().catch(() => ({ detail: res.statusText }));
    throw errorData;
  }

  return res.json();
}

// Mapping functions
export function mapArtwork(api: ArtworkAPI): Artwork {
  // Use local image path if API returns null, otherwise use API image URL
  const localImage = `/artworks/${api.slug}-1600.webp`;
  const image = api.image || localImage;

  // Get local manifest data for fallback
  const manifestData = (manifest as Record<string, { width: number; height: number; aspect: number; blur: string }>)[api.slug];

  return {
    id: api.slug,
    slug: api.slug,
    title: api.title,
    series: api.series as any, // SeriesSlug
    category: api.category as any, // Category
    orientation: api.orientation,
    widthCm: api.width_cm,
    heightCm: api.height_cm,
    year: api.year,
    medium: api.medium,
    type: api.type,
    priceNPR: api.price_npr,
    priceUSD: api.price_usd,
    status: api.status,
    oneOfOne: api.one_of_one,
    justPainted: api.just_painted,
    image: image,
    width: api.width && api.width > 0 ? api.width : (manifestData?.width || 800),
    height: api.height && api.height > 0 ? api.height : (manifestData?.height || 600),
    aspect: api.aspect && api.aspect !== 1.0 ? api.aspect : (manifestData?.aspect || 1.33),
    blurDataURL: api.blur_data_url && api.blur_data_url.length > 0 ? api.blur_data_url : (manifestData?.blur || ''),
    description: api.description,
    tags: api.tags,
  };
}

export function mapCollection(api: CollectionAPI): Collection {
  return {
    slug: api.slug as any,
    title: api.title,
    blurb: api.blurb,
    intro: api.intro,
    cover: api.cover?.id || api.cover?.slug || '',
  };
}

export function mapPost(api: JournalPostAPI) {
  return {
    slug: api.slug,
    title: api.title,
    excerpt: api.excerpt,
    content: api.content,
    publishedAt: api.published_at,
    coverImage: api.cover_image,
  };
}

// API fetchers
export async function getSite(): Promise<SiteAPI> {
  return get<SiteAPI>('/site/');
}

export async function getHome(): Promise<HomeAPI> {
  return get<HomeAPI>('/home/');
}

export async function getArtist(): Promise<ArtistAPI> {
  return get<ArtistAPI>('/artist/');
}

export async function getShopConfig(): Promise<ShopConfigAPI> {
  return get<ShopConfigAPI>('/shop-config/');
}

export async function getCollections(): Promise<CollectionAPI[]> {
  return get<CollectionAPI[]>('/collections/');
}

export async function getCollection(slug: string): Promise<CollectionAPI> {
  return get<CollectionAPI>(`/collections/${slug}/`);
}

export async function getArtworks(params?: {
  type?: string;
  status?: string;
  series?: string;
  category?: string;
  orientation?: string;
  just_painted?: string;
  min_price?: number;
  max_price?: number;
  saved?: string;
  search?: string;
  ordering?: string;
  page_size?: number;
}): Promise<PaginatedResponse<ArtworkAPI>> {
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) query.append(key, String(value));
    });
  }
  return get<PaginatedResponse<ArtworkAPI>>(`/artworks/?${query.toString()}`);
}

export async function getArtwork(slug: string): Promise<ArtworkAPI> {
  return get<ArtworkAPI>(`/artworks/${slug}/`);
}

export async function getJournal(): Promise<PaginatedResponse<JournalPostAPI>> {
  return get<PaginatedResponse<JournalPostAPI>>('/journal/');
}

export async function getJournalPost(slug: string): Promise<JournalPostAPI> {
  return get<JournalPostAPI>(`/journal/${slug}/`);
}

export async function createOrder(order: OrderAPI): Promise<OrderResponseAPI> {
  return post<OrderResponseAPI>('/orders/', order);
}

export async function getOrder(orderId: string, email: string): Promise<OrderResponseAPI> {
  return get<OrderResponseAPI>(`/orders/${orderId}/?email=${encodeURIComponent(email)}`);
}

export async function createCommission(data: CommissionAPI): Promise<SuccessResponseAPI> {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('email', data.email);
  formData.append('phone', data.phone);
  formData.append('size', data.size);
  formData.append('subject', data.subject);
  formData.append('notes', data.notes);
  formData.append('budget', data.budget);
  if (data.similar) formData.append('similar', data.similar);
  if (data.references) {
    data.references.forEach((file) => {
      formData.append('references', file);
    });
  }
  return postFormData<SuccessResponseAPI>('/commissions/', formData);
}

export async function subscribeNewsletter(data: NewsletterAPI): Promise<SuccessResponseAPI> {
  return post<SuccessResponseAPI>('/newsletter/', data);
}

export async function sendContact(data: ContactAPI): Promise<SuccessResponseAPI> {
  return post<SuccessResponseAPI>('/contact/', data);
}

// Client-side fetch with timeout and error handling
export async function getClient<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const url = `${API_URL}/api${path}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}
