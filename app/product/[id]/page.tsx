import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, getProductVariants } from "@/lib/airtable";
import { VariantSwitcher } from "@/components/ui/VariantSwitcher";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PinterestPageTracker } from "@/components/ui/PinterestPageTracker";

// ===================================
// ISR Configuration
// Force dynamic rendering — Airtable attachment URLs expire
export const revalidate = 0;

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
            title: "Product not found",
            description: "This product is no longer available on Calm Home Spaces.",
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
            type: "website",
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

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://calmhomespaces.com";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.title,
        "image": product.imageUrl,
        "description": product.description,
        "sku": product.id,
        "offers": {
            "@type": "Offer",
            "url": `${baseUrl}/product/${product.id}`,
            "priceCurrency": "USD",
            "price": product.price?.toString() || "0.00",
            "itemCondition": "https://schema.org/NewCondition",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": "Calm Home Spaces"
            }
        }
    };

    return (
        <article className="min-h-screen pb-32 md:pb-16">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PinterestPageTracker
                eventName="PageVisit"
                customData={{
                    content_ids: [product.id],
                    content_name: product.title,
                    value: product.price || undefined,
                    currency: "USD",
                }}
            />
            
            {/* Spacer for fixed header */}
            <div className="pt-20" />

            {/* Back navigation */}
            <div className="mx-auto max-w-5xl px-4 py-4">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-700 transition-colors duration-200"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
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
