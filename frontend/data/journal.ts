export interface Post { slug: string; title: string; date: string; tag: string; excerpt: string; body: string[]; cover: string }

// Placeholder essays — replace with your own words (or move to a CMS).
export const posts: Post[] = [
  {
    slug: 'painting-the-porter',
    title: 'Painting the porter',
    date: '2026-10-12',
    tag: 'Process',
    cover: 'porter-misty-forest',
    excerpt: 'How a single figure and a lot of fog became a painting about weight and patience.',
    body: [
      'The porter is the smallest thing in the painting and the reason for it. Everything else, the trees, the mist, the path, exists to make him look as heavy and as light as he feels.',
      'I started with wet paper and let the greens bleed into grey. The figure came last, a few dark strokes, a doko, the lean forward that every porter on a Himalayan trail knows.',
      'Watercolor does not forgive hesitation. This one took about forty minutes, and three days of looking before I knew it was finished.',
    ],
  },
  {
    slug: 'faces-of-the-hills',
    title: 'Faces of the hills',
    date: '2026-09-28',
    tag: 'Series',
    cover: 'bearded-elder',
    excerpt: 'Why the elders keep ending up in my paintings, and what the paper remembers.',
    body: [
      'An old face is a map. I like to paint the creases first and the eyes last, so that when the eyes arrive the whole painting looks back.',
      'The dhaka topi, the smoke, the hands: small details that carry whole afternoons. I try not to explain them. I try to get the grey right.',
    ],
  },
  {
    slug: 'caring-for-watercolor',
    title: 'Caring for a watercolor at home',
    date: '2026-09-10',
    tag: 'Care',
    cover: 'village-machhapuchhre',
    excerpt: 'Light, glass, humidity and a few small habits that keep paper and pigment alive for decades.',
    body: [
      'Watercolor is light-sensitive. Hang it away from direct sun, and if you can, behind UV-filtering glass.',
      'Let the paper breathe: use a mat so the painting never touches the glass, and avoid bathrooms and kitchens.',
      'Dust the frame, not the paper. If something ever looks wrong, write to me before you touch it.',
    ],
  },
];
