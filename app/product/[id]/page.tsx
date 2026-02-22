import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, getProductVariants } from "@/lib/airtable";
import { VariantSwitcher } from "@/components/ui/VariantSwitcher";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// ===================================
// ISR Configuration
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

    if (!product) {
        notFound();
    }

    // Fetch all variants for this product (including the current one)
    const variants = await getProductVariants(product.parentProduct);

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
                <VariantSwitcher
                    variants={variants.length > 0 ? variants : [product]}
                    initialVariantId={product.id}
                />
            </div>

            {/* Related / Trust Section */}
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
