"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

// ==============================================
// Types
// ==============================================

import type { ProductRecord } from "@/lib/airtable";

// Category → placeholder background
const categoryPlaceholders: Record<string, string> = {
    Bureau: "bg-amber-100/60",
    Chambre: "bg-stone-200/60",
    "Salle de bain": "bg-sky-100/40",
    Salon: "bg-stone-200/60",
};

// ==============================================
// Product Card
// ==============================================

function ProductCard({ product }: { product: ProductRecord }) {
    const [imgError, setImgError] = useState(false);

    return (
        <Link
            href={`/product/${product.id}`}
            className="group flex-shrink-0 w-[220px] md:w-auto snap-start block rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
        >
            {/* Image — 1:1 ratio */}
            <div
                className={`relative aspect-square overflow-hidden ${
                    imgError
                        ? categoryPlaceholders[product.category] || "bg-stone-100"
                        : "bg-stone-50"
                }`}
            >
                {!imgError ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 220px, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-stone-300" />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="font-sans text-sm text-stone-700 leading-snug line-clamp-2 group-hover:text-stone-900 transition-colors duration-200">
                    {product.title}
                </h3>

                {product.colorVariant && (
                    <p className="mt-1 text-[11px] text-stone-400">
                        {product.colorVariant}
                    </p>
                )}

                <div className="mt-3">
                    <span className="text-[11px] tracking-wide uppercase text-stone-400 group-hover:text-[#8B7355] transition-colors duration-200">
                        View Product →
                    </span>
                </div>
            </div>
        </Link>
    );
}

// ==============================================
// Shop the Look Section
// ==============================================

export function ShopTheLook({ products }: { products: ProductRecord[] }) {
    if (products.length === 0) return null;

    return (
        <section className="py-20 px-4 scroll-mt-24" style={{ backgroundColor: "#EDE8E0" }}>
            <div className="mx-auto max-w-3xl">
                {/* Separator */}
                <div className="w-12 h-px bg-[#C4B9A8] mb-8" />

                {/* Section header */}
                <div className="flex items-center gap-2 mb-8">
                    <ShoppingBag className="w-4 h-4" style={{ color: "#8B7355" }} />
                    <h2
                        className="text-xs tracking-[0.2em] uppercase font-medium"
                        style={{ color: "#8B7355" }}
                    >
                        Shop the Look
                    </h2>
                </div>

                {/* Desktop: grid — Mobile: horizontal scroll */}
                <div className="hidden md:grid md:grid-cols-3 gap-5">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Mobile carousel */}
                <div
                    className="md:hidden flex gap-4 overflow-x-auto pb-4 -mx-4 px-4"
                    style={{
                        scrollSnapType: "x mandatory",
                        WebkitOverflowScrolling: "touch",
                    }}
                >
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
