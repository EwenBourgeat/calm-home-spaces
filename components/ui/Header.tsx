"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Sticky Header with glass morphism effect on scroll.
 * Minimalist branding — "CALM HOME SPACES" in serif tracking-widest.
 */
export function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled
                    ? "glass-effect border-b border-stone-200/50 shadow-sm"
                    : "bg-transparent"
            )}
        >
            <nav className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
                <Link href="/" className="group">
                    <span className="font-serif text-sm tracking-[0.25em] text-stone-800 group-hover:text-forest transition-colors duration-200">
                        CALM HOME SPACES
                    </span>
                </Link>

                {/* Navigation */}
                <div className="flex items-center gap-4 md:gap-8">
                    <Link
                        href="/"
                        className="relative text-[11px] tracking-[0.15em] text-stone-600 hover:text-forest transition-colors duration-200 uppercase font-semibold group"
                    >
                        Home
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-forest group-hover:w-full transition-all duration-300" />
                    </Link>
                    <Link
                        href="/shop"
                        className="relative text-[11px] tracking-[0.15em] text-stone-600 hover:text-forest transition-colors duration-200 uppercase font-semibold group"
                    >
                        Shop
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-forest group-hover:w-full transition-all duration-300" />
                    </Link>
                    <Link
                        href="/inspiration"
                        className="relative text-[11px] tracking-[0.15em] text-stone-600 hover:text-forest transition-colors duration-200 uppercase font-semibold group"
                    >
                        Blog
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-forest group-hover:w-full transition-all duration-300" />
                    </Link>
                </div>
            </nav>
        </header>
    );
}
