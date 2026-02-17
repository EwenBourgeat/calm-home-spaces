import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct } from "@/lib/airtable";
import { StickyBuyButton } from "@/components/ui/StickyBuyButton";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// ===================================
// ISR Configuration
// Re-generate the page in the background every hour.
// The user sees the cached (fast) version while Next.js
// rebuilds it behind the scenes if data changed.
// ===================================
export const revalidate = 3600;

// ===================================
// Dynamic SEO Metadata
// ===================================
export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return {
            title: "Produit introuvable",
            description: "Ce produit n'est plus disponible sur Calm Home Spaces.",
        };
    }

    const truncatedDescription =
        product.description.length > 160
            ? product.description.slice(0, 157) + "..."
            : product.description;

    return {
        title: product.title,
        description: truncatedDescription,
        openGraph: {
            title: product.title,
            description: truncatedDescription,
            images: [
                {
                    url: product.imageUrl,
                    width: product.imageWidth,
                    height: product.imageHeight,
                    alt: product.title,
                },
            ],
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: product.title,
            description: truncatedDescription,
            images: [product.imageUrl],
        },
    };
}

// ===================================
// Product Page Component (Server Component)
// ===================================
export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const product = await getProduct(id);

    // If the product doesn't exist in Airtable, trigger the custom 404
    if (!product) {
        notFound();
    }

    return (
        <article className="min-h-screen pb-32 md:pb-16">
            {/* Spacer for fixed header */}
            <div className="pt-20" />

            {/* Back navigation */}
            <div className="mx-auto max-w-5xl px-4 py-4">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-700 transition-colors duration-200"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retour</span>
                </Link>
            </div>

            <div className="mx-auto max-w-5xl px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                    {/* ========================================
              Hero Image — Left Column
              Priority loading for LCP optimization
              ======================================== */}
                    <div className="relative w-full">
                        <ImageGallery
                            images={product.images}
                            alt={product.title}
                        />
                    </div>

                    {/* ========================================
              Content — Right Column
              ======================================== */}
                    <div className="flex flex-col justify-center py-4 md:py-8">
                        {/* Category badge */}
                        <span className="inline-block text-xs tracking-[0.2em] uppercase text-stone-400 font-sans mb-4">
                            {product.category}
                        </span>

                        {/* Product Title */}
                        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-stone-900 leading-tight">
                            {product.title}
                        </h1>

                        {/* Decorative divider */}
                        <div className="mt-6 mb-6 w-12 h-px bg-stone-300" />

                        {/* Product Description */}
                        <div className="max-w-prose">
                            <p className="text-stone-600 text-base md:text-lg leading-relaxed whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>

                        {/* Desktop CTA — handled by StickyBuyButton */}
                        <StickyBuyButton
                            amazonUrl={product.amazonUrl}
                            productTitle={product.title}
                        />
                    </div>
                </div>
            </div>

            {/* ========================================
          Related / Trust Section
          ======================================== */}
            <section className="mt-20 border-t border-stone-200/60 pt-12 px-4">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="font-serif text-lg text-stone-600 italic">
                        &ldquo;Un espace bien pensé est un espace où l&apos;on aime revenir.&rdquo;
                    </p>
                    <p className="mt-4 text-xs text-stone-400 tracking-wider uppercase">
                        Calm Home Spaces — Votre magazine déco digital
                    </p>
                </div>
            </section>
        </article>
    );
}
