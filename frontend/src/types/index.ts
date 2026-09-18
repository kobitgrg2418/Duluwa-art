export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  no: string;
  title: string;
  count: number;
  hue: number;
  blurb: string;
  cover: string;
  artworks?: Artwork[];
  artwork_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Artwork {
  id: string;
  title: string;
  year: string;
  medium: string;
  size: string;
  collection: Collection;
  collection_id: string;
  hue: number;
  ratio: number;
  featured: boolean;
  note: string;
  image: string;
  video: string;
  price: number;
  status: "IN_SALE" | "SOLD_OUT";
  created_at: string;
  updated_at: string;
}

export interface ProcessStep {
  no: string;
  title: string;
  hue: number;
  text: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  who: string;
  role: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  artwork: Artwork;
  artwork_id: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  user: User;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  payment_method: "card" | "bank_transfer" | "cash";
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  subtotal: number;
  total: number;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface CommissionInquiry {
  id: string;
  name: string;
  email: string;
  type: "portrait" | "landscape" | "abstract" | "custom";
  size: string;
  medium: string;
  budget: string;
  message: string;
  ref_image: string;
  status: "new" | "contacted" | "quoted" | "accepted" | "declined" | "completed";
  created_at: string;
  updated_at: string;
}

export interface CommissionTier {
  id: string;
  label: string;
  price: number;
  description: string;
  order: number;
}

export interface CommissionPricing {
  id: string;
  tiers: CommissionTier[];
  updated_at: string;
}

export interface SiteMedia {
  key: string;
  value: string;
  label: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  error: boolean;
  message: string;
  details?: unknown;
  status_code: number;
}