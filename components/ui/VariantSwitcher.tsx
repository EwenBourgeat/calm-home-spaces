"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductRecord } from "@/lib/airtable";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { StickyBuyButton } from "@/components/ui/StickyBuyButton";

interface VariantSwitcherProps {
    variants: ProductRecord[];
    initialVariantId: string;
}

/**
 * Client component that manages variant switching on the product detail page.
 * Renders the image gallery, variant image thumbnails, description, and CTA,
 * dynamically updating everything when a variant is selected.
 */
export function VariantSwitcher({ variants, initialVariantId }: VariantSwitcherProps) {
    const initialIndex = Math.max(0, variants.findIndex((v) => v.id === initialVariantId));
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const active = variants[activeIndex];
    const hasVariants = variants.length > 1 && variants.some((v) => v.colorVariant);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Image Gallery — Left Column */}
            <div className="relative w-full">
                <ImageGallery
                    key={active.id}
                    images={active.images}
                    alt={active.title}
                />
            </div>

            {/* Content — Right Column */}
            <div className="flex flex-col justify-center py-4 md:py-8">
                {/* Category badge */}
                <span className="inline-block text-xs tracking-[0.2em] uppercase text-stone-400 font-sans mb-4">
                    {active.category}
                </span>

                {/* Product Title */}
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-stone-900 leading-tight">
                    {active.title}
                </h1>

                {/* Decorative divider */}
                <div className="mt-6 mb-6 w-12 h-px bg-stone-300" />

                {/* Variant image thumbnails */}
                {hasVariants && (
                    <div className="mb-6">
                        <p className="text-xs text-stone-400 uppercase tracking-wider mb-3">
                            Couleur : <span className="text-stone-600">{active.colorVariant}</span>
                        </p>
                        <div className="flex items-center gap-2">
                            {variants.map((variant, i) => (
                                <button
                                    key={variant.id}
                                    onClick={() => setActiveIndex(i)}
                                    title={variant.colorVariant}
                                    className={`
                                        relative w-12 h-12 rounded-lg overflow-hidden transition-all duration-200 shrink-0
                                        ${i === activeIndex
                                            ? "ring-2 ring-stone-800 ring-offset-2 shadow-sm"
                                            : "ring-1 ring-stone-200 hover:ring-stone-400 opacity-60 hover:opacity-100"
                                        }
                                    `}
                                >
                                    <Image
                                        src={variant.imageUrl}
                                        alt={variant.colorVariant || variant.title}
                                        fill
                                        sizes="48px"
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Product Description */}
                <div className="max-w-prose">
                    <p className="text-stone-600 text-base md:text-lg leading-relaxed whitespace-pre-line">
                        {active.description}
                    </p>
                </div>

                {/* CTA button — updates with variant */}
                <StickyBuyButton
                    amazonUrl={active.amazonUrl}
                    productTitle={active.title}
                />
            </div>
        </div>
    );
}
