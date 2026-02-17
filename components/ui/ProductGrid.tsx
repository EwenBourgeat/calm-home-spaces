"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import type { ProductRecord } from "@/lib/airtable";
import { cn } from "@/lib/utils";

interface ProductGridProps {
    products: ProductRecord[];
}

export function ProductGrid({ products }: ProductGridProps) {
    const [activeCategory, setActiveCategory] = useState<string>("Tout");

    // Extract unique categories from products
    const categories = useMemo(() => {
        const cats = Array.from(new Set(products.map((p) => p.category)));
        cats.sort();
        return ["Tout", ...cats];
    }, [products]);

    // Filter products
    const filtered = useMemo(() => {
        if (activeCategory === "Tout") return products;
        return products.filter((p) => p.category === activeCategory);
    }, [products, activeCategory]);

    return (
        <div>
            {/* Filter bar */}
            <div className="flex items-center gap-2 flex-wrap mb-10">
                {categories.map((cat) => {
                    const isActive = cat === activeCategory;
                    const count =
                        cat === "Tout"
                            ? products.length
                            : products.filter((p) => p.category === cat).length;

                    return (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "relative px-5 py-2 rounded-full text-sm font-sans",
                                "transition-all duration-300 ease-out",
                                "border",
                                isActive
                                    ? "bg-stone-900 text-white border-stone-900 shadow-md"
                                    : "bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:text-stone-800 hover:shadow-sm"
                            )}
                        >
                            <span className="relative z-10">
                                {cat}
                                <span
                                    className={cn(
                                        "ml-1.5 text-[11px]",
                                        isActive ? "text-stone-400" : "text-stone-300"
                                    )}
                                >
                                    {count}
                                </span>
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Product grid with animated transitions */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filtered.map((product, index) => (
                    <div
                        key={product.id}
                        className="animate-fade-in-up"
                        style={{
                            animationDelay: `${index * 60}ms`,
                            animationFillMode: "backwards",
                        }}
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
                <div className="text-center py-20 animate-fade-in-up">
                    <p className="font-serif text-lg text-stone-500 italic">
                        Aucun produit dans cette catégorie pour le moment.
                    </p>
                </div>
            )}
        </div>
    );
}
