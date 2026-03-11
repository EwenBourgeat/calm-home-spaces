"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Sticky Header with glass morphism effect on scroll.
 * Features the CalmHomeSpaces logo and prominent navigation.
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
            <nav className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
                <Link href="/" className="group flex items-center gap-0">
                    <Image
                        src="/logo.jpeg"
                        alt="CalmHomeSpaces"
                        width={140}
                        height={40}
                        className="h-8 w-auto object-contain"
                        priority
                    />
                </Link>

                {/* Navigation */}
                <div className="flex items-center gap-6">
                    <Link
                        href="/inspiration"
                        className="relative text-xs tracking-widest text-stone-600 hover:text-forest transition-colors duration-200 uppercase font-medium group"
                    >
                        <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                            </svg>
                            Blog
                        </span>
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-forest group-hover:w-full transition-all duration-300" />
                    </Link>
                    <Link
                        href="/"
                        className="relative text-xs tracking-widest text-stone-600 hover:text-forest transition-colors duration-200 uppercase font-medium group"
                    >
                        <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                            </svg>
                            Shop
                        </span>
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-forest group-hover:w-full transition-all duration-300" />
                    </Link>
                </div>
            </nav>
        </header>
    );
}
