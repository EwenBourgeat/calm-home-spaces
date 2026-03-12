"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import type { ProductGroup } from "@/lib/airtable";
import { BlurImage } from "./BlurImage";
import Image from "next/image";

interface ProductCardProps {
  group: ProductGroup;
}

export function ProductCard({ group }: ProductCardProps) {
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const activeVariant = group.variants[activeVariantIndex];
  const images = activeVariant.images;
  const hasMultipleImages = images.length > 1;
  const hasVariants = group.variants.length > 1 && group.variants.some((v) => v.colorVariant);

  // Auto-cycle through images on hover
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isHovering && hasMultipleImages) {
      interval = setInterval(() => {
        setActiveImageIndex((prev) => (prev + 1) % images.length);
      }, 1500);
    } else {
      setActiveImageIndex(0); // Reset when not hovering
    }
    return () => clearInterval(interval);
  }, [isHovering, hasMultipleImages, images.length]);

  return (
    <Link
      href={`/product/${activeVariant.id}`}
      className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Container - Modern Crossfade Approach */}
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
        {images.map((img, i) => (
          <div
            key={img.url}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${i === activeImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
          >
            <BlurImage
              src={img.url}
              alt={`${activeVariant.title} — photo ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          </div>
        ))}

        {/* Minimal dot indicators (visible on hover) */}
        {hasMultipleImages && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            {images.map((_, i) => (
              <span
                key={i}
                className={`block rounded-full transition-all duration-300 ${i === activeImageIndex
                    ? "w-2 h-2 bg-white shadow-sm"
                    : "w-1.5 h-1.5 bg-white/60"
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
          <p className="text-[11px] text-stone-400 uppercase tracking-widest font-medium group-hover:text-stone-600 transition-colors">
            {activeVariant.category}
          </p>

          {/* Variants selector */}
          {hasVariants && (
            <div className="flex items-center gap-1">
              {group.variants.map((variant, i) => (
                <button
                  key={variant.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveVariantIndex(i);
                    setActiveImageIndex(0);
                  }}
                  title={variant.colorVariant}
                  className={`relative w-5 h-5 rounded-full overflow-hidden transition-all duration-200 shrink-0 ${i === activeVariantIndex
                      ? "ring-1 ring-stone-800 ring-offset-1 scale-110"
                      : "ring-1 ring-stone-200 hover:ring-stone-400 opacity-70 hover:opacity-100"
                    }`}
                >
                  <Image
                    src={variant.imageUrl}
                    alt={variant.colorVariant || variant.title}
                    fill
                    sizes="20px"
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
