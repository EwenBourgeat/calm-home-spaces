"use client";

import { useState, useCallback, useEffect } from "react";
import type { ProductImage } from "@/lib/airtable";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { BlurImage } from "./BlurImage";

interface ImageGalleryProps {
  images: ProductImage[];
  alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    skipSnaps: false,
    dragFree: false,
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const total = images.length;

  if (total === 1) {
    return (
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl bg-stone-100">
        <BlurImage
          src={images[0].url}
          alt={alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Embla Viewport */}
      <div className="overflow-hidden rounded-2xl shadow-xl bg-stone-100" ref={emblaRef}>
        <div className="flex touch-pan-y flex-row h-full">
          {images.map((image, index) => (
            <div
              key={image.url || index}
              className="relative aspect-[3/4] flex-[0_0_100%] min-w-0"
            >
              <BlurImage
                src={image.url}
                alt={`${alt} — image ${index + 1} of ${total}`}
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover select-none pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={(e) => {
          e.preventDefault();
          scrollPrev();
        }}
        disabled={prevBtnDisabled}
        aria-label="Previous image"
        className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 z-10",
          "w-10 h-10 rounded-full",
          "bg-white/80 backdrop-blur-sm shadow-md",
          "flex items-center justify-center",
          "opacity-0 md:opacity-40 group-hover:opacity-100",
          "transition-all duration-300 ease-out",
          "hover:bg-white hover:scale-105",
          "active:scale-95 disabled:opacity-0"
        )}
      >
        <ChevronLeft className="w-5 h-5 text-stone-700" />
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          scrollNext();
        }}
        disabled={nextBtnDisabled}
        aria-label="Next image"
        className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2 z-10",
          "w-10 h-10 rounded-full",
          "bg-white/80 backdrop-blur-sm shadow-md",
          "flex items-center justify-center",
          "opacity-0 md:opacity-40 group-hover:opacity-100",
          "transition-all duration-300 ease-out",
          "hover:bg-white hover:scale-105",
          "active:scale-95 disabled:opacity-0"
        )}
      >
        <ChevronRight className="w-5 h-5 text-stone-700" />
      </button>

      {/* Counter Tag */}
      <div
        className={cn(
          "absolute top-4 right-4 z-10",
          "px-3 py-1 rounded-full",
          "bg-black/30 backdrop-blur-md",
          "text-white text-[11px] font-sans tracking-widest font-medium"
        )}
      >
        {selectedIndex + 1} / {total}
      </div>

      {/* Dots Indicator */}
      <div className="flex items-center justify-center gap-2 mt-5">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={cn(
              "transition-all duration-300 ease-out rounded-full",
              index === selectedIndex
                ? "w-6 h-1.5 bg-stone-800"
                : "w-1.5 h-1.5 bg-stone-300 hover:bg-stone-400"
            )}
          />
        ))}
      </div>
    </div>
  );
}
