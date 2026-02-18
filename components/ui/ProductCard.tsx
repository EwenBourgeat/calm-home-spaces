"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProductRecord } from "@/lib/airtable";

const SLIDE_INTERVAL_MS = 1800;

interface ProductCardProps {
    product: ProductRecord;
}

/**
 * Product Card for the homepage grid.
 * Pinterest-style vertical card with rounded corners, shadow, and hover lift.
 * On hover, auto-cycles through all product images with a crossfade.
 */
export function ProductCard({ product }: ProductCardProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const hasMultipleImages = product.images.length > 1;

    const clearTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const handleMouseEnter = useCallback(() => {
        if (!hasMultipleImages) return;
        setIsHovering(true);
        clearTimer();
        intervalRef.current = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % product.images.length);
        }, SLIDE_INTERVAL_MS);
    }, [hasMultipleImages, product.images.length, clearTimer]);

    const handleMouseLeave = useCallback(() => {
        if (!hasMultipleImages) return;
        setIsHovering(false);
        clearTimer();
        setActiveIndex(0);
    }, [hasMultipleImages, clearTimer]);

    // Cleanup on unmount
    useEffect(() => {
        return () => clearTimer();
    }, [clearTimer]);

    return (
        <Link
            href={`/product/${product.id}`}
            className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Image container — 3:4 aspect ratio, horizontal slide strip */}
            <div className="relative aspect-[3/4] overflow-hidden bg-cream-dark">
                <div
                    className="flex h-full transition-transform duration-600 ease-out"
                    style={{
                        width: `${product.images.length * 100}%`,
                        transform: `translateX(-${activeIndex * (100 / product.images.length)}%)`,
                    }}
                >
                    {product.images.map((img, i) => (
                        <div
                            key={img.url}
                            className="relative h-full shrink-0"
                            style={{ width: `${100 / product.images.length}%` }}
                        >
                            <Image
                                src={img.url}
                                alt={i === 0 ? product.title : `${product.title} — photo ${i + 1}`}
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
                        {product.images.map((_, i) => (
                            <span
                                key={i}
                                className={`block rounded-full transition-all duration-300 ${i === activeIndex
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
                    {product.title}
                </h3>
                <p className="mt-1.5 text-xs text-stone-400 uppercase tracking-wider">
                    {product.category}
                </p>
            </div>
        </Link>
    );
}
