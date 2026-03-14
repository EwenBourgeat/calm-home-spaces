import { getAllProductGroups } from "@/lib/airtable";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { Sparkles, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Shop — The Curated Collection",
  description: "Browse our handpicked selection of Japandi and Scandinavian home decor pieces.",
  alternates: {
    canonical: "/shop",
  },
};

export default async function ShopPage() {
  const groups = await getAllProductGroups();

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 bg-cream">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-4 h-4 text-forest/70" />
            <span className="text-xs tracking-[0.2em] uppercase text-stone-500 font-sans font-medium">
              The Collection
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6">
            Shop the <span className="italic">Essentials</span>
          </h1>
          <p className="text-stone-500 text-lg leading-relaxed">
            A curated selection of timeless pieces designed to bring balance and serenity to your home.
          </p>
        </div>

        {groups.length > 0 ? (
          <ProductGrid groups={groups} />
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cream-dark mb-6">
              <Sparkles className="w-6 h-6 text-stone-400" />
            </div>
            <h3 className="font-serif text-xl text-stone-700 mb-2">
              Refreshing our collection
            </h3>
            <p className="text-stone-400 text-sm">
              We are currently updating our curated pieces. Please check back shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
