"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { EmailCapture } from "./EmailCapture";

// Pages where the popup should never appear
const EXCLUDED_PATHS = ["/affiliate-disclosure", "/japandi-starter-kit"];
const EXCLUDED_PREFIXES = ["/product/"];

export function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const timeOnPageRef = useRef<number>(Date.now());
  const maxScrollRef = useRef<number>(0);

  // Track scroll depth
  const handleScroll = useCallback(() => {
    const scrolled =
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if (scrolled > maxScrollRef.current) {
      maxScrollRef.current = scrolled;
    }
  }, []);

  // Track Amazon affiliate link clicks — circuit breaker
  const handleClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const link = target.closest("a");
    if (
      link?.href &&
      (link.href.includes("amazon.com") ||
        link.href.includes("amzn.to") ||
        link.href.includes("tag=calmhomespace"))
    ) {
      sessionStorage.setItem("amazonClickDone", "true");
    }
  }, []);

  const tryShowPopup = useCallback(() => {
    // 1. Desktop only
    if (window.innerWidth < 768) return;

    // 2. Not already shown this session
    if (sessionStorage.getItem("exitPopupShown")) return;

    // 3. Amazon circuit breaker — don't interrupt a buyer
    if (sessionStorage.getItem("amazonClickDone") === "true") return;

    // 4. At least 45 seconds on page
    if (Date.now() - timeOnPageRef.current < 45_000) return;

    // 5. At least 60% scroll depth
    if (maxScrollRef.current < 60) return;

    sessionStorage.setItem("exitPopupShown", "true");
    setVisible(true);
  }, []);

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (e.clientY <= 0) {
        tryShowPopup();
      }
    },
    [tryShowPopup]
  );

  useEffect(() => {
    // Reset timer on each page navigation
    timeOnPageRef.current = Date.now();
    maxScrollRef.current = 0;

    // Check if excluded path
    const isExcluded =
      EXCLUDED_PATHS.includes(pathname) ||
      EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
    if (isExcluded) return;

    // Don't add listener if already shown this session
    if (sessionStorage.getItem("exitPopupShown")) return;

    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick);
    };
  }, [pathname, handleMouseLeave, handleScroll, handleClick]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) setVisible(false);
      }}
    >
      <div className="relative w-full max-w-2xl mx-4">
        {/* Close button */}
        <button
          onClick={() => setVisible(false)}
          aria-label="Close"
          className="absolute -top-4 -right-4 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white transition-colors shadow-lg"
        >
          <X className="w-4 h-4" />
        </button>

        <EmailCapture onSuccess={() => setVisible(false)} />

        {/* Rejection link */}
        <div className="text-center mt-3">
          <button
            onClick={() => setVisible(false)}
            className="text-[11px] text-stone-400 hover:text-stone-200 transition-colors underline underline-offset-2"
          >
            No thanks, I&apos;ll find my own picks
          </button>
        </div>
      </div>
    </div>
  );
}
