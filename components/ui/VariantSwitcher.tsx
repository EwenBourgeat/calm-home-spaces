"use client";

import { useState } from "react";
import type { ProductRecord } from "@/lib/airtable";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { StickyBuyButton } from "@/components/ui/StickyBuyButton";

interface VariantSwitcherProps {
    variants: ProductRecord[];
    initialVariantId: string;
}

/**
 * Client component that manages variant switching on the product detail page.
 * Renders the image gallery, variant color buttons, description, and CTA,
 * dynamically updating everything when a color variant is selected.
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

                {/* Variant color selector */}
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
                                        w-7 h-7 rounded-full border-2 transition-all duration-200
                                        ${i === activeIndex
                                            ? "border-stone-800 scale-110 shadow-sm"
                                            : "border-stone-200 hover:border-stone-400"
                                        }
                                    `}
                                    style={{
                                        backgroundColor: colorNameToHex(variant.colorVariant),
                                    }}
                                />
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

/** Maps common color names to hex values for swatch display. */
function colorNameToHex(name: string): string {
    const lower = name.toLowerCase().trim();
    const colorMap: Record<string, string> = {
        "blue": "#5B7FA5",
        "light blue": "#A8C4D8",
        "navy": "#2C3E5A",
        "teal": "#5F8A8B",
        "grayish teal": "#7A9E9F",
        "grey": "#9CA3AF",
        "gray": "#9CA3AF",
        "oatmeal linen grey": "#C5BBAE",
        "white": "#F5F0EB",
        "cream": "#F0E6D6",
        "cream white": "#F0E6D6",
        "ivory": "#F0E8D8",
        "light ivory": "#F5EDE0",
        "beige": "#D4C5B0",
        "natural beige": "#D4C5B0",
        "brown": "#8B7355",
        "black": "#2D2D2D",
        "green": "#6B8F71",
        "sage": "#A3AD93",
        "pink": "#D4A0A0",
        "blush": "#E6C4C0",
        "grey-soft blue": "#8FA4B2",
        "flax gray": "#B5AC9A",
        "rust": "#B7553A",
        "mustard": "#C1952A",
        "burgundy": "#722F37",
        "lavender": "#B8A9C9",
        "gold": "#C9A844",
        "sand": "#D2B48C",
        "taupe": "#AE9E87",
        "camel": "#C19A6B",
    };

    if (colorMap[lower]) return colorMap[lower];
    for (const [key, value] of Object.entries(colorMap)) {
        if (lower.includes(key) || key.includes(lower)) return value;
    }
    return "#A8A29E";
}
