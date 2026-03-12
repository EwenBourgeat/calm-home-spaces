import Link from "next/link";
import Image from "next/image";
import { getAllProductGroups, getAllProducts } from "@/lib/airtable";
import { getAllArticles } from "@/data/inspiration-articles";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { Sparkles, BookOpen, ArrowRight, Clock } from "lucide-react";

// Force dynamic rendering — Airtable attachment URLs are signed and expire
// after a few hours, so we must fetch fresh URLs on every request.
export const revalidate = 0;

// Category → muted background color
const categoryColors: Record<string, string> = {
  "Japandi Style": "bg-stone-200/60",
  "Cozy Living": "bg-amber-100/50",
  Scandinavian: "bg-sky-100/40",
};

// Slug → product matching rules for hero images
const SLUG_RULES: Record<string, { categories?: string[]; subCategories?: string[] }> = {
  "japandi-living-room": { categories: ["Salon"], subCategories: ["Lighting"] },
  "cozy-reading-nook": { subCategories: ["Lighting"] },
  "minimalist-bedroom": { categories: ["Chambre"] },
  "hygge-evening-lighting": { subCategories: ["Lighting"] },
  "scandinavian-spring-refresh": { categories: ["Salon"] },
  "japandi-shelf-styling": { categories: ["Salon"] },
  "wabi-sabi-home": { categories: ["Salon"] },
  "minimalist-bathroom": { categories: ["Salle de bain"] },
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
  const allArticles = getAllArticles();
  const featuredArticles = allArticles.slice(0, 3);

  // Build hero image map for featured articles
  const heroImages: Record<string, string | null> = {};
  for (const article of featuredArticles) {
    const rule = SLUG_RULES[article.slug];
    if (!rule) { heroImages[article.slug] = null; continue; }
    const matched = allProducts.filter((p) => {
      if (rule.subCategories?.some((sc) => p.subCategory === sc)) return true;
      if (rule.categories?.some((c) => p.category === c)) return true;
      return false;
    });
    matched.sort((a, b) => a.title.localeCompare(b.title));
    heroImages[article.slug] = matched[0]?.imageUrl || null;
  }

  return (
    <div className="min-h-screen">
      {/* ========================================
          Hero Section
          ======================================== */}
      <section className="pt-28 pb-16 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stone-900 leading-tight">
            Des intérieurs qui
            <br />
            <span className="italic text-stone-600">inspirent le calme</span>
          </h1>
          <p className="mt-6 text-stone-500 text-lg leading-relaxed max-w-xl mx-auto">
            Découvrez notre sélection de pièces déco soigneusement choisies pour
            créer des espaces chaleureux, apaisants et intemporels.
          </p>
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
                Derniers articles
              </h2>
            </div>
            <Link
              href="/inspiration"
              className="flex items-center gap-1.5 text-xs tracking-wide text-forest hover:text-forest/80 transition-colors duration-200 font-medium group"
            >
              Voir tout
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </div>

          {/* Articles row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featuredArticles.map((article, index) => (
              <Link
                key={article.slug}
                href={`/inspiration/${article.slug}`}
                className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "backwards",
                }}
              >
                {/* Hero image or category color band */}
                <div
                  className={`relative h-36 ${!heroImages[article.slug] ? (categoryColors[article.category] || "bg-stone-100") : "bg-stone-100"} flex items-end p-4 overflow-hidden`}
                >
                  {heroImages[article.slug] && (
                    <Image
                      src={heroImages[article.slug]!}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      unoptimized
                    />
                  )}
                  {heroImages[article.slug] && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  )}
                  <span
                    className={`relative z-10 text-[10px] tracking-[0.15em] uppercase font-sans px-3 py-1 rounded-full font-medium ${
                      heroImages[article.slug]
                        ? "text-white bg-white/20 backdrop-blur-sm"
                        : "text-stone-600 bg-white/80 backdrop-blur-sm"
                    }`}
                  >
                    {article.category}
                  </span>
                </div>

                {/* Card body */}
                <div className="p-5">
                  <h3 className="font-serif text-base text-stone-800 leading-snug group-hover:text-forest transition-colors duration-200 line-clamp-2">
                    {article.title}
                  </h3>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-stone-400">
                      <Clock className="w-3 h-3" />
                      <span className="text-[11px]">{article.readTime}</span>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] text-stone-400 group-hover:text-forest transition-colors duration-200">
                      Lire
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
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
              Sélection du moment
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
                Nouvelles pièces bientôt disponibles
              </h3>
              <p className="text-stone-400 text-sm">
                Notre collection est en cours de préparation. Revenez bientôt.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ========================================
          Footer
          ======================================== */}
      <footer className="border-t border-stone-200/60 py-10 px-4">
        <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-serif text-xs tracking-[0.2em] text-stone-400">
            CALM HOME SPACES
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-[10px] text-stone-400 hover:text-stone-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-stone-200">|</span>
            <p className="text-[10px] text-stone-400 text-center md:text-right max-w-sm leading-relaxed">
              En tant que Partenaire Amazon, nous réalisons un bénéfice sur les
              achats remplissant les conditions requises.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
