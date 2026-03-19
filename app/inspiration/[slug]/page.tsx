import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";
import {
    getAllArticles,
    getArticleBySlug,
} from "@/lib/airtable-articles";
import { ShopTheLook } from "@/components/ui/ShopTheLook";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import { PinterestPageTracker } from "@/components/ui/PinterestPageTracker";
import { EmailCapture } from "@/components/ui/EmailCapture";
import { Footer } from "@/components/ui/Footer";

// ==============================================
// ISR — revalidate every 10 minutes so new products appear
export const revalidate = 600;

// ==============================================
// Static Params — pre-generate all 8 article pages
// ==============================================
export async function generateStaticParams() {
    const articles = await getAllArticles();
    return articles.map((a) => ({ slug: a.slug }));
}

// ==============================================
// Dynamic SEO Metadata
// ==============================================
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        return { title: "Article Not Found" };
    }

    return {
        title: article.title,
        description: article.metaDescription,
        openGraph: {
            title: article.title,
            description: article.metaDescription,
            type: "article",
            publishedTime: article.publishedAt,
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description: article.metaDescription,
        },
        alternates: {
            canonical: `/inspiration/${slug}`,
        },
    };
}

// ==============================================
// Product Matching Logic
// ==============================================

import { getAllProducts, type ProductRecord } from "@/lib/airtable";
import { getUniqueHeroImages } from "@/lib/article-utils";

function matchProducts(articleProductIds: string[] | undefined, allProducts: ProductRecord[], category?: string): ProductRecord[] {
    const matchedById = (articleProductIds && articleProductIds.length > 0)
        ? allProducts.filter((p) => articleProductIds.includes(p.id))
        : [];

    if (matchedById.length > 0) {
        matchedById.sort((a, b) => a.title.localeCompare(b.title));
        return matchedById.slice(0, 3);
    }

    // Fallback: match by category if no explicit IDs (common in Airtable sync)
    if (category) {
        const cat = category.toLowerCase();
        const matchedByCategory = allProducts.filter(p => {
            const pCat = p.category.toLowerCase();
            const pSub = p.subCategory.toLowerCase();
            return pCat.includes(cat) || cat.includes(pCat) || 
                   pSub.includes(cat) || cat.includes(pSub) ||
                   (cat === "japandi style" && (pCat === "salon" || pCat === "chambre")) ||
                   (cat === "cozy living" && (pCat === "chambre" || pCat === "salon")) ||
                   (cat === "scandinavian" && pCat === "salon");
        });
        matchedByCategory.sort(() => 0.5 - Math.random()); // Random selection for variety
        return matchedByCategory.slice(0, 3);
    }

    return [];
}

// ==============================================
// Simple Markdown → JSX Renderer
// Handles ## H2, ### H3, **bold**, paragraphs, and lists.
// No external dependency needed.
// ==============================================
function renderMarkdown(content: string) {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let key = 0;
    let currentParagraph: string[] = [];

    const parseInline = (text: string) =>
        text
            .replace(
                /\*\*(.+?)\*\*/g,
                '<strong class="text-stone-800 font-medium">$1</strong>'
            )
            .replace(/\*(.+?)\*/g, "<em>$1</em>");

    const flushParagraph = () => {
        if (currentParagraph.length === 0) return;
        const text = currentParagraph.join(" ");
        elements.push(
            <p
                key={key++}
                className="text-stone-600 text-base md:text-[17px] leading-relaxed mb-6"
                dangerouslySetInnerHTML={{ __html: parseInline(text) }}
            />
        );
        currentParagraph = [];
    };

    const renderAtAGlance = (items: string[]) => {
        const parsed = items.map((raw) => {
            const cleaned = raw.trim();
            const match = cleaned.match(/^\*\*(.+?)\*\*:\s*(.*)$/);
            if (!match) return { label: cleaned, value: "" };
            return { label: match[1], value: match[2] };
        });

        return (
            <section className="mt-10 mb-8 rounded-3xl bg-[#EDE8E0] border border-stone-200/70 px-5 py-6">
                <div className="flex items-center gap-2 mb-6">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#8B7355] font-sans">
                        At a Glance
                    </span>
                    <div className="w-10 h-px bg-[#C4B9A8]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {parsed.map((it, idx) => (
                        <div
                            key={idx}
                            className="rounded-2xl bg-white/55 border border-white/60 p-4"
                        >
                            <p className="text-[10px] tracking-widest uppercase text-stone-400 font-sans">
                                {it.label}
                            </p>
                            {it.value ? (
                                <p
                                    className="mt-2 text-stone-700 text-base md:text-[16px] leading-relaxed"
                                    dangerouslySetInnerHTML={{
                                        __html: parseInline(it.value),
                                    }}
                                />
                            ) : (
                                <p className="mt-2 text-stone-700 text-base md:text-[16px] leading-relaxed">
                                    {it.label}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();

        if (trimmed === "") {
            flushParagraph();
            continue;
        }

        // Special block required by plan2.md
        if (trimmed === "## At a Glance") {
            flushParagraph();
            const items: string[] = [];
            let j = i + 1;
            while (j < lines.length) {
                const t = lines[j].trim();
                if (t === "") break;
                if (t.startsWith("## ") || t.startsWith("### ")) break;
                if (t.startsWith("- ")) items.push(t.slice(2));
                j++;
            }
            elements.push(renderAtAGlance(items));
            i = j - 1;
            continue;
        }

        if (trimmed.startsWith("### ")) {
            flushParagraph();
            elements.push(
                <h3
                    key={key++}
                    className="font-serif text-xl text-stone-800 mt-8 mb-3"
                >
                    {trimmed.slice(4)}
                </h3>
            );
            continue;
        }

        if (trimmed.startsWith("## ")) {
            flushParagraph();
            elements.push(
                <h2
                    key={key++}
                    className="font-serif text-2xl md:text-3xl text-stone-900 mt-12 mb-4"
                >
                    {trimmed.slice(3)}
                </h2>
            );
            continue;
        }

        if (trimmed.startsWith("- ")) {
            flushParagraph();
            const items: string[] = [];
            let j = i;
            while (j < lines.length) {
                const t = lines[j].trim();
                if (!t.startsWith("- ")) break;
                items.push(t.slice(2));
                j++;
            }

            elements.push(
                <ul
                    key={key++}
                    className="ml-5 mb-6 list-disc text-stone-600 text-base md:text-[17px] leading-relaxed"
                >
                    {items.map((item, idx) => (
                        <li
                            key={idx}
                            className="mb-2"
                            dangerouslySetInnerHTML={{ __html: parseInline(item) }}
                        />
                    ))}
                </ul>
            );

            i = j - 1;
            continue;
        }

        currentParagraph.push(trimmed);
    }

    flushParagraph();
    return elements;
}

function estimateTotalTimeISO(readTime: string): string | undefined {
    const match = readTime.match(/(\d+)\s*min/i);
    if (!match) return undefined;
    const minutes = Number(match[1]);
    if (!Number.isFinite(minutes) || minutes <= 0) return undefined;
    return `PT${minutes}M`;
}

function extractHowToSteps(content: string): string[] {
    const lines = content.split("\n");
    const steps: string[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("## ")) continue;

        const heading = trimmed.slice(3).trim();
        if (!heading) continue;
        if (heading.toLowerCase() === "at a glance") continue;

        steps.push(heading);
        if (steps.length >= 8) break;
    }

    return steps;
}

// ==============================================
// Article Page Component
// ==============================================
export default async function InspirationArticlePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        redirect("/inspiration");
    }

    // Fetch related articles by looking through database (excluding current)
    // We fetch all to filter. In a larger app, you'd do this at the DB level.
    const allArticles = await getAllArticles();
    const relatedArticles = allArticles
        .filter((a) => a.slug !== slug && a.category === article.category)
        .slice(0, 2);

    // Fetch products and match for this article
    const allProducts = await getAllProducts();
    const matchedProducts = matchProducts(article.productReferences, allProducts, article.category);

    const heroImages = getUniqueHeroImages(
        [article.slug],
        allProducts,
        (p) => p.category,
        (p) => p.subCategory,
        (p) => p.imageUrl,
        (p) => p.title
    );
    const heroUrl = heroImages[article.slug];

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://calmhomespaces.com";

    const isHowTo = article.slug.startsWith("how-to-");
    const jsonLd: any = {
        "@context": "https://schema.org",
        "@type": isHowTo ? "HowTo" : "BlogPosting",
        description: article.metaDescription,
        datePublished: article.publishedAt,
        author: {
            "@type": "Organization",
            name: "Calm Home Spaces",
        },
        publisher: {
            "@type": "Organization",
            name: "Calm Home Spaces",
            url: baseUrl,
            logo: {
                "@type": "ImageObject",
                url: `${baseUrl}/logo.ico`,
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${baseUrl}/inspiration/${article.slug}`,
        },
        ...(isHowTo ? { name: article.title } : { headline: article.title }),
        ...(heroUrl ? { image: heroUrl } : {}),
        ...(isHowTo
            ? {
                  totalTime: estimateTotalTimeISO(article.readTime),
                  step: extractHowToSteps(article.content).map((heading, idx) => ({
                      "@type": "HowToStep",
                      position: idx + 1,
                      name: heading,
                      text: heading,
                  })),
              }
            : {}),
    };

    return (
        <article className="min-h-screen pb-40 md:pb-16">
            <PinterestPageTracker
                eventName="ViewContent"
                customData={{ content_name: article.slug }}
            />
            {/* JSON-LD Schema (plan2.md: inject in <head>) */}
            <Script
                id="article-jsonld"
                type="application/ld+json"
                strategy="beforeInteractive"
            >
                {JSON.stringify(jsonLd)}
            </Script>

            {/* Spacer for fixed header */}
            <div className="pt-24" />

            {/* Back navigation */}
            <div className="mx-auto max-w-3xl px-4 py-4">
                <Link
                    href="/inspiration"
                    className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-700 transition-colors duration-200"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>All Articles</span>
                </Link>
            </div>

            {/* Article Header */}
            <header className="mx-auto max-w-3xl px-4 pb-8">
                {heroUrl && (
                    <div className="relative w-full h-56 md:h-72 mb-7 rounded-3xl overflow-hidden bg-stone-900">
                        <Image
                            src={heroUrl}
                            alt={article.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 768px"
                            priority
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-black/0" />
                    </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] flex items-center tracking-[0.15em] uppercase text-white font-sans bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                        {article.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-stone-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs">{article.readTime}</span>
                    </div>
                </div>

                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-stone-900 leading-tight">
                    {article.title}
                </h1>

                <p className="mt-4 text-stone-500 text-lg leading-relaxed">
                    {article.subtitle}
                </p>

                <div className="mt-8 w-12 h-px bg-stone-300" />
            </header>

            {/* Article Body */}
            <div className="mx-auto max-w-3xl px-4 pb-16">
                {renderMarkdown(article.content)}
            </div>

            {/* ── Shop the Look (dynamic products) ── */}
            <ShopTheLook products={matchedProducts} />

            {/* ── Email Capture ── */}
            <EmailCapture />

            {/* ── Related Articles ── */}
            {relatedArticles.length > 0 && (
                <section className="border-t border-stone-200/60 py-16 px-4">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="font-serif text-xl text-stone-800 mb-8">
                            Explore More
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {relatedArticles.map((related) => (
                                <Link
                                    key={related.slug}
                                    href={`/inspiration/${related.slug}`}
                                    className="group block rounded-xl bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    <span className="text-[10px] tracking-[0.15em] uppercase text-stone-400 font-sans">
                                        {related.category}
                                    </span>
                                    <h3 className="mt-2 font-serif text-sm text-stone-800 leading-snug group-hover:text-forest transition-colors duration-200">
                                        {related.title}
                                    </h3>
                                    <div className="mt-3 flex items-center gap-1 text-xs text-stone-400 group-hover:text-forest transition-colors duration-200">
                                        Read article
                                        <ArrowRight className="w-3 h-3" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <Footer />
        </article>
    );
}
