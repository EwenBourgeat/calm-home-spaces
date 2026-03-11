import Link from "next/link";
import Image from "next/image";
import { getAllArticles } from "@/data/inspiration-articles";
import { Sparkles, Clock, ArrowRight } from "lucide-react";
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

// Category → muted background color for cards
const categoryColors: Record<string, string> = {
    "Japandi Style": "bg-stone-200/60",
    "Cozy Living": "bg-amber-100/50",
    Scandinavian: "bg-sky-100/40",
};

export default function InspirationIndexPage() {
    const articles = getAllArticles();

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
                        {articles.map((article, index) => (
                            <Link
                                key={article.slug}
                                href={`/inspiration/${article.slug}`}
                                className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                                style={{
                                    animationDelay: `${index * 80}ms`,
                                    animationFillMode: "backwards",
                                }}
                            >
                                {/* Category color band */}
                                <div
                                    className={`h-40 ${categoryColors[article.category] || "bg-stone-100"} flex items-end p-5`}
                                >
                                    <span className="text-[10px] tracking-[0.15em] uppercase text-stone-500 font-sans bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full">
                                        {article.category}
                                    </span>
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
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
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
                            En tant que Partenaire Amazon, nous réalisons un
                            bénéfice sur les achats remplissant les conditions
                            requises.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
