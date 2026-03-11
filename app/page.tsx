import Link from "next/link";
import Image from "next/image";
import { getAllProductGroups } from "@/lib/airtable";
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

/**
 * Homepage — "Digital Decor Magazine" landing page.
 * Displays a curated grid of product groups from Airtable with category filters.
 */
export default async function HomePage() {
  const groups = await getAllProductGroups();
  const allArticles = getAllArticles();
  const featuredArticles = allArticles.slice(0, 3);

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
                {/* Category color band */}
                <div
                  className={`h-32 ${categoryColors[article.category] || "bg-stone-100"} flex items-end p-4 relative overflow-hidden`}
                >
                  {/* Decorative element */}
                  <div className="absolute top-3 right-3 w-16 h-16 rounded-full bg-white/20 blur-xl" />
                  <span className="relative text-[10px] tracking-[0.15em] uppercase text-stone-600 font-sans bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full font-medium">
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
          <Link href="/">
            <Image
              src="/logo.jpeg"
              alt="CalmHomeSpaces"
              width={120}
              height={35}
              className="h-7 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
            />
          </Link>
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
