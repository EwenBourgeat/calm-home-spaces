import Link from "next/link";
import Image from "next/image";
import { getAllArticles } from "@/data/inspiration-articles";
import { Sparkles, Clock, ArrowRight, ShoppingBag } from "lucide-react";
import { getUniqueHeroImages } from "@/lib/article-utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Inspiration — Calm Home Ideas",
    description:
        "Discover curated articles on Japandi style, hygge living, and minimalist home decor. Ideas and guides for creating calm, beautiful spaces.",
    openGraph: {
        title: "Inspiration — Calm Home Ideas",
        description:
            "Curated articles on Japandi style, hygge living, and minimalist decor for calm, beautiful spaces.",
    },
};

// ISR — revalidate every hour to get fresh product images
export const revalidate = 3600;

// Category → muted background color for cards (fallback when no image)
const categoryColors: Record<string, string> = {
    "Japandi Style": "bg-stone-200/60",
    "Cozy Living": "bg-amber-100/50",
    Scandinavian: "bg-sky-100/40",
};

// ==============================================
// Product fetching
// ==============================================

interface ApiProduct {
    id: string;
    clean_title: string;
    category: string;
    sub_category: string;
    product_image_url: string;
}

async function fetchProducts(): Promise<ApiProduct[]> {
    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_SITE_URL || "https://calmhomespaces.com";
        const res = await fetch(`${baseUrl}/api/products`, {
            next: { revalidate: 3600 },
        });

        if (!res.ok) return [];

        const data = await res.json();
        if (Array.isArray(data)) return data;
        return data.products || [];
    } catch {
        return [];
    }
}

// ==============================================
// Page Component
// ==============================================

export default async function InspirationIndexPage() {
    const articles = getAllArticles();
    const products = await fetchProducts();

    const heroImages = getUniqueHeroImages(
        articles.map((a) => a.slug),
        products,
        (p) => p.category,
        (p) => p.sub_category, // ApiProduct has sub_category
        (p) => p.product_image_url,
        (p) => p.clean_title
    );

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="pt-28 pb-12 px-4">
                <div className="mx-auto max-w-3xl text-center">
                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stone-900 leading-tight">
                        Inspiration
                    </h1>
                    <p className="mt-4 text-stone-500 text-lg leading-relaxed max-w-xl mx-auto">
                        Ideas and guides for creating calm, minimal, and
                        beautiful living spaces.
                    </p>
                    <div className="mt-6 w-12 h-px bg-stone-300 mx-auto" />
                </div>
            </section>

            {/* Article Grid */}
            <section className="px-4 pb-24">
                <div className="mx-auto max-w-4xl">
                    <div className="flex items-center gap-2 mb-8">
                        <Sparkles className="w-4 h-4 text-stone-400" />
                        <h2 className="text-xs tracking-[0.2em] uppercase text-stone-400 font-sans">
                            Latest Articles
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {articles.map((article, index) => {
                            const heroUrl = heroImages[article.slug];

                            return (
                                <Link
                                    key={article.slug}
                                    href={`/inspiration/${article.slug}`}
                                    className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                                    style={{
                                        animationDelay: `${index * 80}ms`,
                                        animationFillMode: "backwards",
                                    }}
                                >
                                    {/* Hero image or color band */}
                                    <div
                                        className={`relative h-48 ${
                                            !heroUrl
                                                ? categoryColors[article.category] || "bg-stone-100"
                                                : "bg-stone-100"
                                        } flex items-end p-5 overflow-hidden`}
                                    >
                                        {heroUrl && (
                                            <Image
                                                src={heroUrl}
                                                alt={article.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                unoptimized
                                            />
                                        )}
                                        {/* Gradient overlay for readability */}
                                        {heroUrl && (
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                                        )}
                                        <div className="relative z-10 flex flex-wrap items-center gap-2">
                                            <span
                                                className={`text-[10px] tracking-[0.15em] uppercase font-sans px-3 py-1 rounded-full ${
                                                    heroUrl
                                                        ? "text-white bg-white/20 backdrop-blur-sm"
                                                        : "text-stone-500 bg-white/70 backdrop-blur-sm"
                                                }`}
                                            >
                                                {article.category}
                                            </span>
                                            {heroUrl && (
                                                <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                                                    <ShoppingBag className="w-2.5 h-2.5" />
                                                    Shoppable
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card body */}
                                    <div className="p-5">
                                        <h3 className="font-serif text-lg text-stone-800 leading-snug group-hover:text-forest transition-colors duration-200">
                                            {article.title}
                                        </h3>
                                        <p className="mt-2 text-sm text-stone-500 leading-relaxed line-clamp-2">
                                            {article.subtitle}
                                        </p>

                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-stone-400">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span className="text-xs">
                                                    {article.readTime}
                                                </span>
                                            </div>
                                            <span className="flex items-center gap-1 text-xs text-stone-400 group-hover:text-forest transition-colors duration-200">
                                                Read
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Footer */}
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
                            As an Amazon Associate, we earn from qualifying purchases.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
