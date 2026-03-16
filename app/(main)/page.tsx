import Link from "next/link";
import Image from "next/image";
import { getAllProductGroups, getAllProducts } from "@/lib/airtable";
import { getAllArticles } from "@/lib/airtable-articles";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { Sparkles, BookOpen, Clock, ShoppingBag, ArrowRight } from "lucide-react";
import { getUniqueHeroImages } from "@/lib/article-utils";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/ui/Footer";
import { EmailCapture } from "@/components/ui/EmailCapture";

import type { Metadata } from "next";

// Force dynamic rendering — Airtable attachment URLs are signed and expire
// after a few hours, so we must fetch fresh URLs on every request.
export const revalidate = 0;

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

// Category → muted background color
const categoryColors: Record<string, string> = {
  "Japandi Style": "bg-stone-200/60",
  "Cozy Living": "bg-amber-100/50",
  Scandinavian: "bg-sky-100/40",
};

/**
 * Homepage — "Digital Decor Magazine" landing page.
 * Displays a curated grid of product groups from Airtable with category filters.
 */
export default async function HomePage() {
  const [groups, allProducts] = await Promise.all([
    getAllProductGroups(),
    getAllProducts(),
  ]);
  const allArticles = await getAllArticles();
  const featuredArticles = allArticles.slice(0, 5); // 5 elements for Bento Grid

  // Build hero image map ensuring uniqueness
  const heroImages = getUniqueHeroImages(
    featuredArticles.map((a) => a.slug),
    allProducts,
    (p) => p.category,
    (p) => p.subCategory, // AirtableProduct has subCategory
    (p) => p.imageUrl,
    (p) => p.title
  );

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://calmhomespaces.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": baseUrl,
        "name": "Calm Home Spaces",
        "description": "Discover beautifully curated home decor pieces. Handpicked lighting, furniture, and accessories for your calm, cozy living space.",
        "publisher": {
          "@id": `${baseUrl}/#organization`
        }
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": "Calm Home Spaces",
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.ico`
        }
      }
    ]
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ========================================
          Hero Section
          ======================================== */}
      <section className="pt-28 pb-16 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stone-900 leading-tight">
            Interiors that
            <br />
            <span className="italic text-stone-600">inspire calm</span>
          </h1>
          <p className="mt-6 text-stone-500 text-lg leading-relaxed max-w-xl mx-auto">
            Discover our selection of carefully chosen decor pieces to create warm, calming, and timeless spaces.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-4 bg-stone-900 text-white text-xs tracking-[0.2em] uppercase font-semibold rounded-full hover:bg-forest transition-all duration-300 shadow-lg shadow-stone-200"
            >
              Browse Shop
            </Link>
            <Link
              href="/inspiration"
              className="w-full sm:w-auto px-8 py-4 bg-white text-stone-900 border border-stone-200 text-xs tracking-[0.2em] uppercase font-semibold rounded-full hover:bg-stone-50 transition-all duration-300"
            >
              Read Blog
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================
          Inspiration Section — Featured Articles
          ======================================== */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          {/* Section header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-forest/70" />
              <h2 className="text-xs tracking-[0.2em] uppercase text-stone-500 font-sans font-medium">
                Latest Articles
              </h2>
            </div>
            <Link
              href="/inspiration"
              className="flex items-center gap-1.5 text-xs tracking-wide text-forest hover:text-forest/80 transition-colors duration-200 font-medium group"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </div>

          {/* Articles Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:min-h-[500px]">
            {featuredArticles.map((article, index) => {
              const heroUrl = heroImages[article.slug];
              
              return (
                <Link
                  key={article.slug}
                  href={`/inspiration/${article.slug}`}
                  className={cn(
                    "group block rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative flex flex-col justify-end animate-fade-in-up",
                    !heroUrl ? "bg-stone-800" : "bg-stone-200",
                    index === 0 ? "md:col-span-2 md:row-span-2 min-h-[400px]" : "col-span-1 row-span-1 min-h-[250px] md:h-full"
                  )}
                  style={{
                    animationDelay: `${index * 80}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  {/* Hero image */}
                  {heroUrl && (
                    <Image
                      src={heroUrl}
                      alt={article.title}
                      fill
                      priority={index === 0}
                      sizes={index === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                  
                  {/* Gradient overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5" />
  
                  {/* Card body */}
                  <div className="relative z-10 p-5 md:p-6 w-full">
                    {/* Top badging */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-[9px] tracking-[0.15em] uppercase font-sans px-2.5 py-1 rounded-full font-medium text-white bg-white/20 backdrop-blur-md border border-white/10">
                        {article.category}
                      </span>
                      {heroUrl && (
                        <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-white bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                          <ShoppingBag className="w-2.5 h-2.5" />
                          Shoppable
                        </span>
                      )}
                    </div>
                    
                    <h3 className={cn(
                      "font-serif text-white leading-snug group-hover:text-stone-200 transition-colors duration-200",
                      index === 0 ? "text-2xl md:text-3xl lg:text-4xl mb-3" : "text-lg md:text-base lg:text-lg mb-2 line-clamp-2"
                    )}>
                      {article.title}
                    </h3>
  
                    {index === 0 && (
                      <p className="hidden md:block text-stone-300 text-sm leading-relaxed mb-4 line-clamp-2">
                        {article.subtitle}
                      </p>
                    )}
  
                    <div className="flex items-center gap-1.5 text-stone-300 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Clock className="w-3 h-3" />
                      <span className="text-[11px]">{article.readTime}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================
          Products Grid with Filters
          ======================================== */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-6xl">
          {/* Section heading */}
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-4 h-4 text-stone-400" />
            <h2 className="text-xs tracking-[0.2em] uppercase text-stone-400 font-sans">
              Current Selection
            </h2>
          </div>

          {groups.length > 0 ? (
            <ProductGrid groups={groups} />
          ) : (
            /* Empty state */
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cream-dark mb-6">
                <Sparkles className="w-6 h-6 text-stone-400" />
              </div>
              <h3 className="font-serif text-xl text-stone-700 mb-2">
                New pieces coming soon
              </h3>
              <p className="text-stone-400 text-sm">
                Our collection is being prepared. Check back soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section with Anchor ID */}
      <div id="subscribe">
        <EmailCapture />
      </div>

      {/* ========================================
          Footer
          ======================================== */}
      <Footer />
    </div>
  );
}
