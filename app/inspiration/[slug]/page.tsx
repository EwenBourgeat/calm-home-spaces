import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
    getAllArticles,
    getArticleBySlug,
    getRelatedArticles,
} from "@/data/inspiration-articles";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";

// ==============================================
// Static Params — pre-generate all 8 article pages
// ==============================================
export function generateStaticParams() {
    return getAllArticles().map((a) => ({ slug: a.slug }));
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
    const article = getArticleBySlug(slug);

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
    };
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

    const flushParagraph = () => {
        if (currentParagraph.length > 0) {
            const text = currentParagraph.join(" ");
            elements.push(
                <p
                    key={key++}
                    className="text-stone-600 text-base md:text-[17px] leading-relaxed mb-6"
                    dangerouslySetInnerHTML={{
                        __html: text
                            .replace(
                                /\*\*(.+?)\*\*/g,
                                '<strong class="text-stone-800 font-medium">$1</strong>'
                            )
                            .replace(
                                /\*(.+?)\*/g,
                                '<em>$1</em>'
                            ),
                    }}
                />
            );
            currentParagraph = [];
        }
    };

    for (const line of lines) {
        const trimmed = line.trim();

        if (trimmed === "") {
            flushParagraph();
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
        } else if (trimmed.startsWith("## ")) {
            flushParagraph();
            elements.push(
                <h2
                    key={key++}
                    className="font-serif text-2xl md:text-3xl text-stone-900 mt-12 mb-4"
                >
                    {trimmed.slice(3)}
                </h2>
            );
        } else if (trimmed.startsWith("- ")) {
            flushParagraph();
            const itemText = trimmed.slice(2);
            elements.push(
                <li
                    key={key++}
                    className="text-stone-600 text-base md:text-[17px] leading-relaxed ml-5 mb-2 list-disc"
                    dangerouslySetInnerHTML={{
                        __html: itemText
                            .replace(
                                /\*\*(.+?)\*\*/g,
                                '<strong class="text-stone-800 font-medium">$1</strong>'
                            )
                            .replace(
                                /\*(.+?)\*/g,
                                '<em>$1</em>'
                            ),
                    }}
                />
            );
        } else {
            currentParagraph.push(trimmed);
        }
    }
    flushParagraph();

    return elements;
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
    const article = getArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    const relatedArticles = getRelatedArticles(article.relatedSlugs);

    // JSON-LD structured data for SEO
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.metaDescription,
        datePublished: article.publishedAt,
        author: {
            "@type": "Organization",
            name: "Calm Home Spaces",
        },
        publisher: {
            "@type": "Organization",
            name: "Calm Home Spaces",
            url: "https://calmhomespaces.com",
        },
    };

    return (
        <article className="min-h-screen">
            {/* JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Spacer for fixed header */}
            <div className="pt-20" />

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
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] tracking-[0.15em] uppercase text-stone-500 font-sans bg-stone-100 px-3 py-1 rounded-full">
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
            <footer className="border-t border-stone-200/60 py-10 px-4">
                <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <span className="font-serif text-xs tracking-[0.2em] text-stone-400">
                        CALM HOME SPACES
                    </span>
                    <p className="text-[10px] text-stone-400 text-center md:text-right max-w-sm leading-relaxed">
                        En tant que Partenaire Amazon, nous réalisons un
                        bénéfice sur les achats remplissant les conditions
                        requises.
                    </p>
                </div>
            </footer>
        </article>
    );
}
