"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/airtable";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
    images: ProductImage[];
    alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
    const [order, setOrder] = useState(() => images.map((_, i) => i));
    const [isAnimating, setIsAnimating] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const total = images.length;

    const goNext = useCallback(() => {
        if (isAnimating || total <= 1) return;
        setIsAnimating(true);
        setSwipeDirection("left");

        setTimeout(() => {
            setOrder((prev) => {
                const next = [...prev];
                const removed = next.shift()!;
                next.push(removed);
                return next;
            });
            setSwipeDirection(null);
            setIsAnimating(false);
        }, 450);
    }, [isAnimating, total]);

    const goPrev = useCallback(() => {
        if (isAnimating || total <= 1) return;
        setIsAnimating(true);
        setSwipeDirection("right");

        setOrder((prev) => {
            const next = [...prev];
            const last = next.pop()!;
            next.unshift(last);
            return next;
        });

        setTimeout(() => {
            setSwipeDirection(null);
            setIsAnimating(false);
        }, 450);
    }, [isAnimating, total]);

    // Drag handling
    const handleDragStart = useCallback((clientX: number) => {
        if (isAnimating) return;
        setIsDragging(true);
        dragStart.current = clientX;
        setDragOffset(0);
    }, [isAnimating]);

    const handleDragMove = useCallback(
        (clientX: number) => {
            if (!isDragging) return;
            setDragOffset(clientX - dragStart.current);
        },
        [isDragging]
    );

    const handleDragEnd = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);

        const threshold = 80;
        if (dragOffset < -threshold) {
            goNext();
        } else if (dragOffset > threshold) {
            goPrev();
        }
        setDragOffset(0);
    }, [isDragging, dragOffset, goNext, goPrev]);

    // Keyboard
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "ArrowRight") goNext();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [goPrev, goNext]);

    const currentImageIndex = order[0];

    // Single image
    if (total <= 1) {
        return (
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl bg-stone-100">
                <Image
                    src={images[0].url}
                    alt={alt}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover image-reveal"
                />
            </div>
        );
    }

    return (
        <div className="relative group">
            {/* Stack container */}
            <div
                ref={containerRef}
                className="relative aspect-[3/4] cursor-grab active:cursor-grabbing"
                onMouseDown={(e) => { e.preventDefault(); handleDragStart(e.clientX); }}
                onMouseMove={(e) => handleDragMove(e.clientX)}
                onMouseUp={handleDragEnd}
                onMouseLeave={() => { if (isDragging) handleDragEnd(); }}
                onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
                onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
                onTouchEnd={handleDragEnd}
            >
                {/* Render in reverse so order[0] is on top */}
                {[...order].reverse().map((imageIndex, stackPosition) => {
                    const distFromTop = total - 1 - stackPosition;
                    const isTop = distFromTop === 0;
                    const isSecond = distFromTop === 1;

                    // Show max 3 cards
                    if (distFromTop > 2) return null;

                    // Stack: small offset to peek behind, no scale/opacity changes
                    const baseOffsetY = distFromTop * 6;
                    const baseOffsetX = distFromTop * 3;

                    let transform = "";

                    if (isTop) {
                        if (isDragging) {
                            const rotation = dragOffset * 0.04;
                            transform = `translateX(${dragOffset}px) rotate(${rotation}deg)`;
                        } else if (swipeDirection === "left") {
                            transform = "translateX(-120%) rotate(-12deg)";
                        } else {
                            transform = "translateX(0) translateY(0)";
                        }
                    } else if (isSecond && swipeDirection === "left") {
                        // Spring up to top position
                        transform = "translateX(0) translateY(0)";
                    } else {
                        transform = `translateX(${baseOffsetX}px) translateY(${baseOffsetY}px)`;
                    }

                    const zIndex = total - distFromTop;

                    return (
                        <div
                            key={imageIndex}
                            className={cn(
                                "absolute inset-0 rounded-2xl overflow-hidden",
                                "origin-bottom-left",
                                // Shadow: stronger for top card, subtle for behind
                                isTop ? "shadow-xl" : "shadow-lg",
                                !isDragging && "transition-all duration-[450ms] ease-[cubic-bezier(0.23,1,0.32,1)]",
                                isTop && isDragging && "transition-none",
                            )}
                            style={{
                                zIndex,
                                transform,
                            }}
                        >
                            <Image
                                src={images[imageIndex].url}
                                alt={`${alt} — ${imageIndex + 1}/${total}`}
                                fill
                                priority={distFromTop === 0}
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover select-none pointer-events-none"
                                draggable={false}
                            />
                        </div>
                    );
                })}

                {/* Arrows on hover */}
                <button
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    aria-label="Image précédente"
                    className={cn(
                        "absolute left-3 top-1/2 -translate-y-1/2 z-50",
                        "w-10 h-10 rounded-full",
                        "bg-white/80 backdrop-blur-sm shadow-md",
                        "flex items-center justify-center",
                        "opacity-0 group-hover:opacity-100",
                        "transition-all duration-300 ease-out",
                        "hover:bg-white hover:scale-105",
                        "active:scale-95"
                    )}
                >
                    <ChevronLeft className="w-5 h-5 text-stone-700" />
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    aria-label="Image suivante"
                    className={cn(
                        "absolute right-3 top-1/2 -translate-y-1/2 z-50",
                        "w-10 h-10 rounded-full",
                        "bg-white/80 backdrop-blur-sm shadow-md",
                        "flex items-center justify-center",
                        "opacity-0 group-hover:opacity-100",
                        "transition-all duration-300 ease-out",
                        "hover:bg-white hover:scale-105",
                        "active:scale-95"
                    )}
                >
                    <ChevronRight className="w-5 h-5 text-stone-700" />
                </button>

                {/* Counter */}
                <div
                    className={cn(
                        "absolute top-4 right-4 z-50",
                        "px-3 py-1 rounded-full",
                        "bg-black/40 backdrop-blur-sm",
                        "text-white text-xs font-sans tracking-wide"
                    )}
                >
                    {currentImageIndex + 1} / {total}
                </div>
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-5">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            if (i === currentImageIndex || isAnimating) return;
                            const idx = order.indexOf(i);
                            if (idx > 0) {
                                setOrder((prev) => [...prev.slice(idx), ...prev.slice(0, idx)]);
                            }
                        }}
                        aria-label={`Voir image ${i + 1}`}
                        className={cn(
                            "transition-all duration-300 ease-out rounded-full",
                            i === currentImageIndex
                                ? "w-6 h-2 bg-stone-800"
                                : "w-2 h-2 bg-stone-300 hover:bg-stone-400"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
