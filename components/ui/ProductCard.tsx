"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProductGroup } from "@/lib/airtable";

const SLIDE_INTERVAL_MS = 1800;

interface ProductCardProps {
    group: ProductGroup;
}

/**
 * Product Card for the homepage grid.
 * Displays one card per product group, with color swatches for multi-variant groups.
 * On hover, auto-cycles through images with a horizontal slide transition.
 */
export function ProductCard({ group }: ProductCardProps) {
    const [activeVariantIndex, setActiveVariantIndex] = useState(0);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const activeVariant = group.variants[activeVariantIndex];
    const images = activeVariant.images;
    const hasMultipleImages = images.length > 1;
    const hasVariants = group.variants.length > 1 && group.variants.some((v) => v.colorVariant);

    const clearTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const startTimer = useCallback(() => {
        if (!hasMultipleImages) return;
        clearTimer();
        intervalRef.current = setInterval(() => {
            setActiveImageIndex((prev) => (prev + 1) % images.length);
        }, SLIDE_INTERVAL_MS);
    }, [hasMultipleImages, images.length, clearTimer]);

    const handleMouseEnter = useCallback(() => {
        setIsHovering(true);
        if (hasMultipleImages) {
            startTimer();
        }
    }, [hasMultipleImages, startTimer]);

    const handleMouseLeave = useCallback(() => {
        setIsHovering(false);
        clearTimer();
        setActiveImageIndex(0);
    }, [clearTimer]);

    // Reset image index when variant changes
    useEffect(() => {
        setActiveImageIndex(0);
        if (isHovering && images.length > 1) {
            startTimer();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeVariantIndex]);

    // Cleanup on unmount
    useEffect(() => {
        return () => clearTimer();
    }, [clearTimer]);

    const handleVariantClick = (e: React.MouseEvent, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveVariantIndex(index);
    };

    return (
        <Link
            href={`/product/${activeVariant.id}`}
            className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Image container — 3:4 aspect ratio, horizontal slide strip */}
            <div className="relative aspect-[3/4] overflow-hidden bg-cream-dark">
                <div
                    className="flex h-full transition-transform duration-600 ease-out"
                    style={{
                        width: `${images.length * 100}%`,
                        transform: `translateX(-${activeImageIndex * (100 / images.length)}%)`,
                    }}
                >
                    {images.map((img, i) => (
                        <div
                            key={img.url}
                            className="relative h-full shrink-0"
                            style={{ width: `${100 / images.length}%` }}
                        >
                            <Image
                                src={img.url}
                                alt={i === 0 ? activeVariant.title : `${activeVariant.title} — photo ${i + 1}`}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>

                {/* Dot indicators — only visible on hover for multi-image products */}
                {hasMultipleImages && (
                    <div
                        className={`absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 transition-opacity duration-300 ${isHovering ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        {images.map((_, i) => (
                            <span
                                key={i}
                                className={`block rounded-full transition-all duration-300 ${i === activeImageIndex
                                    ? "w-2 h-2 bg-white shadow-sm"
                                    : "w-1.5 h-1.5 bg-white/50"
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Card body */}
            <div className="p-4">
                <h3 className="font-serif text-sm text-stone-800 leading-snug line-clamp-2">
                    {activeVariant.title}
                </h3>

                <div className="flex items-center justify-between mt-1.5">
                    <p className="text-xs text-stone-400 uppercase tracking-wider">
                        {activeVariant.category}
                    </p>

                    {/* Color swatches */}
                    {hasVariants && (
                        <div className="flex items-center gap-1.5">
                            {group.variants.map((variant, i) => (
                                <button
                                    key={variant.id}
                                    onClick={(e) => handleVariantClick(e, i)}
                                    title={variant.colorVariant}
                                    className={`
                                        w-4 h-4 rounded-full border-2 transition-all duration-200
                                        ${i === activeVariantIndex
                                            ? "border-stone-800 scale-110"
                                            : "border-stone-200 hover:border-stone-400"
                                        }
                                    `}
                                    style={{
                                        backgroundColor: colorNameToHex(variant.colorVariant),
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}

/**
 * Maps common color names to hex values for swatch display.
 * Falls back to a neutral tone for unknown colors.
 */
function colorNameToHex(name: string): string {
    const lower = name.toLowerCase().trim();
    const colorMap: Record<string, string> = {
        // Blues
        "blue": "#5B7FA5",
        "light blue": "#A8C4D8",
        "navy": "#2C3E5A",
        "dark blue": "#2C3E5A",
        "teal": "#5F8A8B",
        "grayish teal": "#7A9E9F",

        // Greys
        "grey": "#9CA3AF",
        "gray": "#9CA3AF",
        "light grey": "#C4C9CF",
        "dark grey": "#5A5F66",
        "charcoal": "#3D4148",
        "oatmeal linen grey": "#C5BBAE",

        // Whites / Creams
        "white": "#F5F0EB",
        "cream": "#F0E6D6",
        "cream white": "#F0E6D6",
        "ivory": "#F0E8D8",
        "light ivory": "#F5EDE0",
        "off-white": "#EDE7DB",
        "beige": "#D4C5B0",
        "natural beige": "#D4C5B0",

        // Browns / Warm
        "brown": "#8B7355",
        "dark brown": "#5C4A32",
        "tan": "#C9A96E",
        "sand": "#D2B48C",
        "taupe": "#AE9E87",
        "camel": "#C19A6B",
        "rust": "#B7553A",

        // Blacks
        "black": "#2D2D2D",

        // Greens
        "green": "#6B8F71",
        "sage": "#A3AD93",
        "olive": "#808040",
        "forest green": "#4A6741",

        // Pinks / Warm tones
        "pink": "#D4A0A0",
        "blush": "#E6C4C0",
        "rose": "#C9908D",

        // Purples
        "purple": "#8B7DAF",
        "lavender": "#B8A9C9",

        // Yellows / Golds
        "yellow": "#E8D166",
        "gold": "#C9A844",
        "mustard": "#C1952A",

        // Reds
        "red": "#B54040",
        "burgundy": "#722F37",
        "wine": "#722F37",

        // Multi / Compound
        "grey-soft blue": "#8FA4B2",
        "flax gray": "#B5AC9A",
    };

    // Try exact match
    if (colorMap[lower]) return colorMap[lower];

    // Try partial match (first matching key)
    for (const [key, value] of Object.entries(colorMap)) {
        if (lower.includes(key) || key.includes(lower)) {
            return value;
        }
    }

    // Fallback: neutral stone
    return "#A8A29E";
}
