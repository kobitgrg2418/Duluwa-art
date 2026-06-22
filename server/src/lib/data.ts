export interface Collection {
  id: string;
  no: string;
  title: string;
  count: number;
  hue: number;
  blurb: string;
  cover: string;
}

export type ArtworkStatus = "IN_SALE" | "SOLD_OUT";

export interface Artwork {
  id: string;
  title: string;
  year: string;
  medium: string;
  size: string;
  coll: string;
  hue: number;
  ratio: number;
  feat: boolean;
  note: string;
  image?: string;
  video?: string;
  price: number;
  status: ArtworkStatus;
}

export interface SiteMedia {
  key: string;
  value: string;
  label: string;
}

export interface ProcessStep {
  no: string;
  title: string;
  hue: number;
  text: string;
}

export interface Testimonial {
  quote: string;
  who: string;
  role: string;
}

export const COLLECTIONS: Collection[] = [
  { id: "culture", no: "01", title: "Nepalese Culture", count: 18, hue: 28, cover: "",
    blurb: "Festivals, prayer flags and the quiet rituals of the courtyards of Kathmandu." },
  { id: "portrait", no: "02", title: "Portraits", count: 24, hue: 44, cover: "",
    blurb: "Faces weathered by altitude and devotion — studies in patience and pigment." },
  { id: "himalaya", no: "03", title: "Himalayan Landscapes", count: 21, hue: 220, cover: "",
    blurb: "First light on snow, monsoon valleys, the long blue distance of the high passes." },
  { id: "wildlife", no: "04", title: "Wildlife", count: 16, hue: 96, cover: "",
    blurb: "The tiger, the danphe, the river otter — caught in a single held breath of water." },
  { id: "lifestyle", no: "05", title: "Traditional Lifestyle", count: 19, hue: 64, cover: "",
    blurb: "Tea fields, terraced farms and the slow choreography of mountain daily life." },
  { id: "sketches", no: "06", title: "Watercolour Sketches", count: 32, hue: 36, cover: "",
    blurb: "Loose, fast, unguarded — the notebook where every finished work begins." },
  { id: "still-life", no: "07", title: "Still Life", count: 14, hue: 160, cover: "",
    blurb: "Fruit, flowers and familiar objects — stillness observed until it speaks in colour and shadow." },
];

export const ARTWORKS: Artwork[] = [
  { id: "a1", title: "Indra Jatra, Dusk", year: "2024", medium: "Watercolour on cotton rag", size: "76 × 56 cm",
    coll: "culture", hue: 26, ratio: 0.78, feat: true, price: 1200, status: "IN_SALE",
    note: "Masked dancers under the last copper light of the festival square.", image: "/assets/IMG_3838.jpeg" },
  { id: "a2", title: "The Lama's Hands", year: "2023", medium: "Watercolour & graphite", size: "40 × 50 cm",
    coll: "portrait", hue: 42, ratio: 1.28, feat: true, price: 650, status: "IN_SALE",
    note: "A study of stillness — beads, knuckles, ninety winters.", image: "/assets/IMG_20230519_0002.jpeg" },
  { id: "a3", title: "Machhapuchhre, First Light", year: "2024", medium: "Watercolour on cotton rag", size: "90 × 60 cm",
    coll: "himalaya", hue: 218, ratio: 0.7, feat: true, price: 1800, status: "IN_SALE",
    note: "The fishtail summit emerging from the cold blue of dawn.", image: "/assets/IMG_6277.jpeg" },
  { id: "a4", title: "Bengal Tiger, Bardiya", year: "2023", medium: "Watercolour on rag", size: "70 × 50 cm",
    coll: "wildlife", hue: 92, ratio: 0.82, feat: true, price: 1400, status: "IN_SALE",
    note: "Wet-in-wet stripes dissolving into the tall grass.", image: "/assets/IMG_0536.jpeg" },
  { id: "a5", title: "Tea Pickers, Ilam", year: "2022", medium: "Watercolour on cotton rag", size: "64 × 48 cm",
    coll: "lifestyle", hue: 62, ratio: 1.18, feat: false, price: 950, status: "IN_SALE",
    note: "Bent backs and baskets across the green terraces.", image: "/assets/IMG_0645.jpg" },
  { id: "a6", title: "Boudhanath in Rain", year: "2024", medium: "Watercolour sketch", size: "30 × 30 cm",
    coll: "sketches", hue: 34, ratio: 1, feat: false, price: 380, status: "IN_SALE",
    note: "Fifteen minutes, one brush, the great stupa under monsoon.", image: "/assets/IMG_0798.jpeg" },
  { id: "a7", title: "Woman of Mustang", year: "2023", medium: "Watercolour & graphite", size: "42 × 56 cm",
    coll: "portrait", hue: 38, ratio: 0.75, feat: false, price: 850, status: "IN_SALE",
    note: "Coral, turquoise and a gaze that has crossed the high desert.", image: "/assets/IMG_2873.jpeg" },
  { id: "a8", title: "Danphe in Snow", year: "2024", medium: "Watercolour on rag", size: "38 × 46 cm",
    coll: "wildlife", hue: 200, ratio: 0.84, feat: false, price: 720, status: "IN_SALE",
    note: "The Himalayan monal — iridescence built in transparent layers.", image: "/assets/IMG_2875.jpeg" },
  { id: "a9", title: "Prayer Flags, Langtang", year: "2022", medium: "Watercolour on cotton rag", size: "80 × 54 cm",
    coll: "culture", hue: 30, ratio: 0.74, feat: false, price: 1100, status: "IN_SALE",
    note: "Lungta scattering colour across a thin mountain wind.", image: "/assets/IMG_2877.jpeg" },
  { id: "a10", title: "Annapurna Sanctuary", year: "2023", medium: "Watercolour on rag", size: "100 × 56 cm",
    coll: "himalaya", hue: 224, ratio: 0.56, feat: false, price: 2200, status: "IN_SALE",
    note: "A panorama held in one continuous wet wash.", image: "/assets/IMG_3246.jpeg" },
  { id: "a11", title: "Potter of Bhaktapur", year: "2024", medium: "Watercolour sketch", size: "32 × 40 cm",
    coll: "lifestyle", hue: 48, ratio: 0.8, feat: false, price: 420, status: "IN_SALE",
    note: "Clay, wheel, and hands that have never hurried.", image: "/assets/IMG_3956.jpeg" },
  { id: "a12", title: "River Otter, Karnali", year: "2022", medium: "Watercolour sketch", size: "28 × 28 cm",
    coll: "sketches", hue: 70, ratio: 1, feat: false, price: 350, status: "IN_SALE",
    note: "A quick gesture — wet fur, wet paper, wet light.", image: "/assets/IMG_3957.jpeg" },
];

export const PROCESS: ProcessStep[] = [
  { no: "01", title: "The Paper", hue: 40,
    text: "Every painting begins with cold-pressed cotton rag, torn by hand and stretched the night before. The tooth and weight of the paper decide how the water will pool, bleed and settle." },
  { no: "02", title: "Wet on Wet", hue: 28,
    text: "The paper is soaked and pigment is dropped into the wet surface — colours bloom, merge and push into one another with a life of their own. This wet-on-wet technique creates the soft, atmospheric washes that no dry brush can imitate. Timing is everything: too early and the colour vanishes, too late and hard edges appear." },
  { no: "03", title: "Building Light", hue: 52,
    text: "Once the first wash dries, transparent glazes are layered one over another. The light is never painted — it is the white of the paper, carefully protected. Each new layer deepens tone while preserving luminosity beneath." },
  { no: "04", title: "The Detail", hue: 36,
    text: "Only at the end, with a near-dry brush, do the eyes, the stitch, the single blade of grass arrive. Restraint is the whole discipline — knowing when to stop is what separates watercolour from every other medium." },
];

export const TESTIMONIALS: Testimonial[] = [
  { quote: "Kobit paints water with water. Standing before the Machhapuchhre piece, I felt the cold of that dawn on my own skin.",
    who: "Aruna Rana", role: "Curator, Kathmandu Contemporary" },
  { quote: "A self-taught mastery that institutions spend lifetimes chasing. The restraint is what undoes you — he knows exactly what to leave as paper.",
    who: "Daniel Hofmann", role: "Collector, Zürich" },
  { quote: "The portraits do not flatter; they remember. Each face carries the altitude it was painted at.",
    who: "Sushila Pradhan", role: "Editor, Himal Review" },
];

export function collTitle(id: string): string {
  const c = COLLECTIONS.find((x) => x.id === id);
  return c ? c.title : id;
}

export function artIndex(id: string): number {
  return ARTWORKS.findIndex((a) => a.id === id);
}
