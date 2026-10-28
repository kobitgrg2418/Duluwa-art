"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import RevixNavbar from "@/components/revix-navbar";
import RevixFooter from "@/components/revix-footer";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { Artwork } from "@/types";

interface FeaturedPiece {
  id: string;
  title: string;
  category: string;
  year: string;
  medium: string;
  size: string;
  image: string;
  price: number;
  formattedPrice: string;
  description: string;
  tag: string;
}

const featuredArtworks: FeaturedPiece[] = [
  {
    id: "a1",
    title: "Machhapuchhre, First Light",
    category: "Himalaya",
    year: "2024",
    medium: "Watercolour on cotton rag",
    size: "90 x 60 cm",
    image: "/art/drawing-09.jpg",
    price: 1800,
    formattedPrice: "Rs. 1,800",
    description: "The iconic fishtail summit emerging from the cold sapphire blue of Himalayan dawn.",
    tag: "Current Exhibition",
  },
  {
    id: "a2",
    title: "Monsoon Valley",
    category: "Himalaya",
    year: "2023",
    medium: "Watercolour on rag",
    size: "60 x 45 cm",
    image: "/art/drawing-07.jpg",
    price: 1100,
    formattedPrice: "Rs. 1,100",
    description: "Dense mist and monsoon rain rolling across emerald terrace fields.",
    tag: "Curator's Pick",
  },
  {
    id: "a4",
    title: "The Lama's Hands",
    category: "Culture & Portrait",
    year: "2023",
    medium: "Watercolour and graphite",
    size: "40 x 50 cm",
    image: "/art/drawing-03.jpg",
    price: 650,
    formattedPrice: "Rs. 650",
    description: "A study of stillness, prayer beads, and the quiet dignity of ninety mountain winters.",
    tag: "Permanent Collection",
  },
  {
    id: "a7",
    title: "Woman of Mustang",
    category: "Portrait",
    year: "2023",
    medium: "Watercolour and graphite",
    size: "42 x 56 cm",
    image: "/art/drawing-02.jpg",
    price: 850,
    formattedPrice: "Rs. 850",
    description: "Sun-etched silver jewellery, turquoise beads, and deep desert mountain gazes.",
    tag: "On View Now",
  },
  {
    id: "a5",
    title: "Shadows in Swayambhu",
    category: "Kathmandu Heritage",
    year: "2024",
    medium: "Ink and watercolour",
    size: "50 x 70 cm",
    image: "/art/drawing-05.jpg",
    price: 1400,
    formattedPrice: "Rs. 1,400",
    description: "Late afternoon light cutting through cedar incense smoke around ancient stupas.",
    tag: "Special Feature",
  },
  {
    id: "a6",
    title: "Bhaktapur Clay Potter",
    category: "Culture",
    year: "2024",
    medium: "Graphite and wash",
    size: "45 x 60 cm",
    image: "/art/drawing-06.jpg",
    price: 950,
    formattedPrice: "Rs. 950",
    description: "Spun mud, deft thumbs, and drying terracotta under warm terracotta sun.",
    tag: "Heritage Series",
  },
];

export default function RevixHome() {
  const [sliderIndex, setSliderIndex] = useState(0);
  const { addItem } = useCart();

  const handleAddToCart = (artwork: FeaturedPiece) => {
    const artObj: Artwork = {
      id: artwork.id,
      title: artwork.title,
      year: artwork.year,
      medium: artwork.medium,
      size: artwork.size,
      collection: {
        id: "c1",
        no: "01",
        title: artwork.category,
        count: 1,
        hue: 200,
        blurb: "",
        cover: artwork.image,
        created_at: "",
        updated_at: "",
      },
      collection_id: "c1",
      hue: 200,
      ratio: 1.33,
      featured: true,
      note: artwork.description,
      image: artwork.image,
      video: "",
      price: artwork.price,
      status: "IN_SALE",
      created_at: "",
      updated_at: "",
    };

    addItem(artObj);
    toast.success(`"${artwork.title}" added to your cart.`);
  };

  const nextSlide = () => {
    setSliderIndex((prev) => (prev + 1) % featuredArtworks.length);
  };

  const prevSlide = () => {
    setSliderIndex((prev) => (prev - 1 + featuredArtworks.length) % featuredArtworks.length);
  };

  return (
    <div className="bg-[#fcfcfc] text-black min-h-screen">
      <RevixNavbar />

      {/* Hero Section - Matching REVIX Framer Hero */}
      <section className="rx-hero">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-12 border-b border-black/10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-black/50 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#ff2a2a]"></span>
              Contemporary Art Gallery &bull; Kathmandu
            </div>
            <h1 className="rx-hero-title">
              A Space for<br />
              Bold Expression
            </h1>
          </div>
          <div className="max-w-md">
            <p className="rx-hero-sub mb-6">
              Duluwa Art showcases authentic Himalayan watercolour and fine art commissions that
              inspire, challenge, and redefine contemporary visual expression.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="rx-btn rx-btn-black">
                Explore Artworks <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/commission" className="rx-btn rx-btn-outline">
                Request Commission
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Slider / Hero Stage */}
        <div className="pt-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-black/50 font-semibold block mb-1">
                Featured Highlights
              </span>
              <h2 className="text-2xl font-bold tracking-tight">Current Showcase</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-all"
                aria-label="Previous artwork"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-all"
                aria-label="Next artwork"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dynamic 3-card Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArtworks.slice(sliderIndex, sliderIndex + 3).concat(
              featuredArtworks.slice(0, Math.max(0, sliderIndex + 3 - featuredArtworks.length))
            ).map((artwork, idx) => (
              <div key={artwork.id + idx} className="rx-card group">
                <div className="rx-card-media relative">
                  <Image
                    src={artwork.image}
                    alt={artwork.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="rx-tag bg-white/90 backdrop-blur-sm text-black">
                      {artwork.tag}
                    </span>
                  </div>
                </div>
                <div className="rx-card-info">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="rx-card-title">{artwork.title}</h3>
                    <span className="font-semibold text-sm">{artwork.formattedPrice}</span>
                  </div>
                  <p className="text-xs text-black/60 mb-4">{artwork.medium} &bull; {artwork.size}</p>
                  <p className="text-sm text-black/70 mb-5 line-clamp-2">{artwork.description}</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleAddToCart(artwork)}
                      className="rx-btn rx-btn-black text-[11px] py-2 px-4"
                    >
                      Collect Artwork
                    </button>
                    <Link
                      href={`/shop`}
                      className="text-xs font-semibold underline text-black/70 hover:text-black"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Gallery Story Section - Matching REVIX Framer Story */}
      <section className="border-t border-black/10 py-24 px-8 max-w-[1720px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs uppercase tracking-widest text-black/50 font-semibold block mb-3">
              Since 2019 &bull; Kathmandu
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-8 leading-tight">
              The Story of<br />
              Duluwa Gallery
            </h2>
            <p className="text-base text-black/70 leading-relaxed mb-6">
              Born from a passion for the quiet grandeur of the Himalayas and the ancient alleys of
              the Kathmandu Valley, Duluwa Art represents a dedication to observational mastery,
              delicate watercolour balance, and authentic Nepalese heritage.
            </p>
            <p className="text-base text-black/70 leading-relaxed mb-8">
              Every stroke is an intimate record of light across mountain ridges, sacred traditions,
              and human emotion. We collaborate with art lovers worldwide on custom bespoke commissions
              and curated exhibitions.
            </p>
            <div className="flex gap-4">
              <Link href="/about" className="rx-btn rx-btn-black">
                Read Artist Story <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/contact" className="rx-btn rx-btn-outline">
                Visit Studio
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-6">
            <div className="relative aspect-[3/4] rounded overflow-hidden">
              <Image
                src="/art/drawing-01.jpg"
                alt="Duluwa Studio work"
                fill
                sizes="(max-width: 1024px) 50vw, 35vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="relative aspect-[3/4] rounded overflow-hidden mt-12">
              <Image
                src="/art/drawing-04.jpg"
                alt="Himalayan Watercolour Artwork"
                fill
                sizes="(max-width: 1024px) 50vw, 35vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Exhibitions & Categories Showcase */}
      <section className="border-t border-black/10 py-24 px-8 max-w-[1720px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-black/50 font-semibold block mb-2">
              Curated Collections
            </span>
            <h2 className="text-4xl font-bold tracking-tight">Gallery Exhibitions</h2>
          </div>
          <Link href="/collections" className="rx-btn rx-btn-outline">
            View All Collections <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="rx-grid">
          {featuredArtworks.map((piece) => (
            <div key={piece.id} className="rx-card group">
              <div className="rx-card-media relative">
                <Image
                  src={piece.image}
                  alt={piece.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="rx-card-info">
                <div className="flex justify-between items-center mb-1">
                  <span className="rx-tag">{piece.category}</span>
                  <span className="font-semibold text-sm">{piece.formattedPrice}</span>
                </div>
                <h4 className="rx-card-title">{piece.title}</h4>
                <p className="rx-card-meta">{piece.medium} &bull; {piece.year}</p>
                <div className="mt-4 pt-3 border-t border-black/5 flex justify-between items-center">
                  <span className="text-xs text-black/60">{piece.size}</span>
                  <button
                    onClick={() => handleAddToCart(piece)}
                    className="text-xs font-bold text-black uppercase tracking-wider hover:opacity-70"
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REVIX Dark Visiting & Contact Section */}
      <section className="rx-dark-section">
        <div className="rx-dark-inner">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-6">
              <span className="text-xs uppercase tracking-widest text-white/50 font-semibold block mb-3">
                Experience in Person
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-8">
                Visiting Details
              </h2>
              <p className="text-white/70 leading-relaxed max-w-lg mb-10">
                Immerse yourself in our serene studio gallery. View original artworks in person,
                consult directly with the artist on custom commissions, and experience the textures
                and subtleties of Nepalese cotton rag watercolour.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="rx-btn rx-btn-white">
                  Book Studio Visit <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/commission" className="rx-btn rx-btn-outline-white">
                  Commission Custom Art
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-8 border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-12">
              <div>
                <span className="text-xs uppercase tracking-widest text-white/40 font-semibold block mb-2">
                  Location
                </span>
                <p className="text-lg font-semibold mb-1">Thamel Studio</p>
                <p className="text-white/60 text-sm">Thamel Marg, Kathmandu 44600, Nepal</p>
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-white/40 font-semibold block mb-2">
                  Gallery Hours
                </span>
                <p className="text-lg font-semibold mb-1">Daily 10 AM – 7 PM</p>
                <p className="text-white/60 text-sm">Open on weekends &amp; holidays</p>
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-white/40 font-semibold block mb-2">
                  Direct Inquiries
                </span>
                <p className="text-lg font-semibold mb-1">+977 1 4700000</p>
                <p className="text-white/60 text-sm">Studio direct phone line</p>
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-white/40 font-semibold block mb-2">
                  Email
                </span>
                <p className="text-lg font-semibold mb-1">info@duluwaart.com</p>
                <p className="text-white/60 text-sm">Response within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section - Matching Framer Quote */}
      <section className="py-28 px-8 max-w-[1200px] mx-auto text-center">
        <Sparkles className="w-8 h-8 mx-auto mb-6 text-black/30" />
        <blockquote className="text-2xl md:text-4xl font-bold tracking-tight leading-snug mb-8">
          &ldquo;Art uncovers the unseen and voices the unspoken, urging us to pause, reflect, and see the mountain world differently.&rdquo;
        </blockquote>
        <div className="text-sm font-semibold tracking-wider uppercase text-black/60">
          Duluwa &bull; Lead Artist &amp; Founder
        </div>
      </section>

      <RevixFooter />
    </div>
  );
}
