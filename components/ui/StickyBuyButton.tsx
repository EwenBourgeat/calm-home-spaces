"use client";

import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface StickyBuyButtonProps {
    amazonUrl: string;
    productTitle: string;
}

/**
 * CTA Button that links to Amazon.
 * - Fixed at the bottom of the viewport on mobile
 * - Inline on desktop
 * - Always includes the FTC/Amazon affiliate disclaimer
 * - Uses rel="nofollow noreferrer noopener" for link safety
 */
export function StickyBuyButton({ amazonUrl, productTitle }: StickyBuyButtonProps) {
    return (
        <>
            {/* ========================================
          Desktop CTA — shown inline in the page flow
          ======================================== */}
            <div className="hidden md:block mt-8">
                <a
                    href={amazonUrl}
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                    aria-label={`Voir ${productTitle} sur Amazon`}
                    className={cn(
                        "inline-flex items-center justify-center gap-3",
                        "bg-forest text-cream px-8 py-4 rounded-full",
                        "font-sans text-sm tracking-wide font-medium",
                        "hover:bg-forest-light transition-all duration-300",
                        "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    )}
                >
                    <ShoppingBag className="w-5 h-5" />
                    Voir sur Amazon
                </a>

                {/* Affiliate disclaimer — always visible, never hidden by CSS */}
                <p className="mt-3 text-xs text-stone-400 leading-relaxed max-w-sm">
                    En tant que Partenaire Amazon, nous réalisons un bénéfice sur les achats
                    remplissant les conditions requises.
                </p>
            </div>

            {/* ========================================
          Mobile Sticky CTA — fixed at viewport bottom
          ======================================== */}
            <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pb-6 md:hidden bg-gradient-to-t from-cream via-cream/95 to-transparent">
                <a
                    href={amazonUrl}
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                    aria-label={`Voir ${productTitle} sur Amazon`}
                    className={cn(
                        "flex items-center justify-center gap-3 w-full",
                        "bg-forest text-cream py-4 rounded-full",
                        "font-sans text-sm tracking-wide font-medium",
                        "shadow-xl active:scale-[0.98] transition-transform duration-150"
                    )}
                >
                    <ShoppingBag className="w-5 h-5" />
                    Voir sur Amazon
                </a>

                {/* Affiliate disclaimer — always visible on mobile */}
                <p className="mt-2 text-center text-[10px] text-stone-400 leading-tight px-4">
                    En tant que Partenaire Amazon, nous réalisons un bénéfice sur les achats
                    remplissant les conditions requises.
                </p>
            </div>
        </>
    );
}
