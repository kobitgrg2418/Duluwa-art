/**
 * Reads every photo in /artworks-src, writes:
 *   public/artworks/<id>-{480,960,1600}.{avif,webp}
 * and data/images.generated.json with width/height/aspect/blur placeholder.
 * Skips files whose outputs are already up to date.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = path.resolve('artworks-src');
const OUT = path.resolve('public/artworks');
const MANIFEST = path.resolve('data/images.generated.json');
const SIZES = [480, 960, 1600];

// original file -> stable id used everywhere in the site
export const FILE_IDS: Record<string, string> = {
  '10881B7E-C6A1-44E2-8932-59B8F6C3C18A.JPEG': 'porter-misty-forest',
  'A16277BC-5E32-4E2D-B061-6F25C3935CED.jpg': 'child-with-bowl',
  'IMG_20230519_0002.jpeg': 'two-sparrows',
  'IMG_20230521_0003.jpeg': 'guitarist',
  'IMG_20230610_0005.jpeg': 'village-machhapuchhre',
  'IMG_20261005_0001.jpeg': 'ceremonial-headdress',
  'IMG_20261005_0002.jpeg': 'guinea-pigs',
  'IMG_20261006_0001.jpg': 'elder-smoke',
  'IMG_20261010_0001.jpg': 'bearded-elder',
  'IMG_20261010_0002.jpg': 'yak-caravan',
  'IMG_20261010_0003.jpg': 'elder-lighting-up',
  'IMG_20261010_0004.jpg': 'meadow-travellers',
  'IMG_20261010_0005.jpg': 'blue-blossom-sparrows',
  'IMG_20261010_0006.jpg': 'mountain-hut',
  'IMG_20261010_0007.jpg': 'bison',
  'IMG_20261010_0008.jpg': 'young-woman-clasped',
  'IMG_20261010_0009.jpg': 'young-woman-earrings',
  'IMG_4559.jpg': 'elder-smoke-variant',
};

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const manifest: Record<string, { width: number; height: number; aspect: number; blur: string }> = {};
  for (const file of fs.readdirSync(SRC)) {
    const id = FILE_IDS[file];
    if (!id) { console.warn('no id for', file); continue; }
    const input = path.join(SRC, file);
    const base = sharp(input).rotate();
    const meta = await base.clone().metadata();
    const { data, info } = await base.clone().toBuffer({ resolveWithObject: true });
    void data;
    const width = info.width, height = info.height;
    const blurBuf = await base.clone().resize(20).jpeg({ quality: 60 }).toBuffer();
    manifest[id] = {
      width, height, aspect: width / height,
      blur: `data:image/jpeg;base64,${blurBuf.toString('base64')}`,
    };
    void meta;
    for (const w of SIZES) {
      const webp = path.join(OUT, `${id}-${w}.webp`);
      if (fs.existsSync(webp) && fs.statSync(webp).mtimeMs > fs.statSync(input).mtimeMs) continue;
      const r = base.clone().resize({ width: w, withoutEnlargement: true });
      await r.clone().webp({ quality: 82 }).toFile(webp);
      await r.clone().avif({ quality: 55 }).toFile(path.join(OUT, `${id}-${w}.avif`));
    }
    console.log('processed', id, width + 'x' + height);
  }
  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
}
main();
