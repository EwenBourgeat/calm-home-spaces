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
 * Displays one card per product group, with image-based variant thumbnails.
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

                <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-stone-400 uppercase tracking-wider">
                        {activeVariant.category}
                    </p>

                    {/* Variant image thumbnails */}
                    {hasVariants && (
                        <div className="flex items-center gap-1">
                            {group.variants.map((variant, i) => (
                                <button
                                    key={variant.id}
                                    onClick={(e) => handleVariantClick(e, i)}
                                    title={variant.colorVariant}
                                    className={`
                                        relative w-6 h-6 rounded-md overflow-hidden transition-all duration-200 shrink-0
                                        ${i === activeVariantIndex
                                            ? "ring-2 ring-stone-800 ring-offset-1"
                                            : "ring-1 ring-stone-200 hover:ring-stone-400 opacity-70 hover:opacity-100"
                                        }
                                    `}
                                >
                                    <Image
                                        src={variant.imageUrl}
                                        alt={variant.colorVariant || variant.title}
                                        fill
                                        sizes="24px"
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
