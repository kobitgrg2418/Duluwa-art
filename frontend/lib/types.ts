export type SeriesSlug = 'himalayan-faces' | 'mountain-paths' | 'wild-and-small' | 'portraits-of-youth';
export type Category = 'portrait' | 'landscape' | 'wildlife';
export type Orientation = 'portrait' | 'landscape';
export type ArtType = 'original' | 'print';
export type Status = 'available' | 'sold';

export interface Artwork {
  id: string;
  slug: string;
  title: string;
  series: SeriesSlug;
  category: Category;
  orientation: Orientation;
  widthCm: number;
  heightCm: number;
  year: number;
  medium: string;
  type: ArtType;
  priceNPR: number;
  priceUSD: number;
  status: Status;
  oneOfOne: boolean;
  justPainted: boolean;
  image: string; // id -> /public/artworks/<id>-<w>.webp
  width: number;
  height: number;
  aspect: number;
  blurDataURL: string;
  description: string;
  tags: string[];
}

export interface Collection {
  slug: SeriesSlug;
  title: string;
  blurb: string;
  intro: string;
  cover: string; // artwork id
}

export interface CartLine {
  key: string; // artworkId + option
  artworkId: string;
  option?: string; // print size/paper
  unitNPR: number;
  qty: number;
}
