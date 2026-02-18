import Link from "next/link";
import { getAllProducts } from "@/lib/airtable";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { Sparkles } from "lucide-react";

// ISR: Revalidate the homepage every hour
export const revalidate = 3600;

/**
 * Homepage — "Digital Decor Magazine" landing page.
 * Displays a curated grid of products from Airtable with category filters.
 */
export default async function HomePage() {
  const products = await getAllProducts();

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

          {products.length > 0 ? (
            <ProductGrid products={products} />
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
