import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  COLLECTIONS,
  ARTWORKS,
  PROCESS,
  TESTIMONIALS,
} from "../src/lib/data";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Collections
  for (const c of COLLECTIONS) {
    await prisma.collection.upsert({
      where: { id: c.id },
      update: { no: c.no, title: c.title, count: c.count, hue: c.hue, blurb: c.blurb },
      create: { id: c.id, no: c.no, title: c.title, count: c.count, hue: c.hue, blurb: c.blurb },
    });
  }
  console.log(`  ${COLLECTIONS.length} collections`);

  // Artworks
  for (const a of ARTWORKS) {
    await prisma.artwork.upsert({
      where: { id: a.id },
      update: {
        title: a.title, year: a.year, medium: a.medium, size: a.size,
        collectionId: a.coll, hue: a.hue, ratio: a.ratio, featured: a.feat,
        note: a.note, image: a.image ?? "", price: a.price, status: a.status,
      },
      create: {
        id: a.id, title: a.title, year: a.year, medium: a.medium, size: a.size,
        collectionId: a.coll, hue: a.hue, ratio: a.ratio, featured: a.feat,
        note: a.note, image: a.image ?? "", price: a.price, status: a.status,
      },
    });
  }
  console.log(`  ${ARTWORKS.length} artworks`);

  // Process steps
  for (const p of PROCESS) {
    await prisma.processStep.upsert({
      where: { no: p.no },
      update: { title: p.title, hue: p.hue, text: p.text },
      create: { no: p.no, title: p.title, hue: p.hue, text: p.text },
    });
  }
  console.log(`  ${PROCESS.length} process steps`);

  // Testimonials
  const existingCount = await prisma.testimonial.count();
  if (existingCount === 0) {
    for (const t of TESTIMONIALS) {
      await prisma.testimonial.create({
        data: { quote: t.quote, who: t.who, role: t.role },
      });
    }
    console.log(`  ${TESTIMONIALS.length} testimonials`);
  } else {
    console.log(`  testimonials already exist, skipping`);
  }

  // Admin user
  const adminEmail = "admin@duluwa.art";
  const salt = "duluwa-salt-2024";
  const data = new TextEncoder().encode("admin123" + salt);
  const hashBuf = await crypto.subtle.digest("SHA-256", data);
  const hashed = Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN" },
    create: { name: "Admin", email: adminEmail, password: hashed, role: "ADMIN" },
  });
  console.log("  admin user ready (admin@duluwa.art / admin123)");

  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
