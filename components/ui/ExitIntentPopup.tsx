"use client";

import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";
import { EmailCapture } from "./EmailCapture";

export function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    // Only trigger when mouse exits toward the top of the screen
    if (e.clientY > 20) return;

    // Don't show on mobile
    if (window.innerWidth < 768) return;

    // Only show once per session
    if (sessionStorage.getItem("exitPopupShown")) return;

    sessionStorage.setItem("exitPopupShown", "true");
    setVisible(true);
  }, []);

  useEffect(() => {
    // Don't add listener if already shown this session
    if (sessionStorage.getItem("exitPopupShown")) return;

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [handleMouseLeave]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) setVisible(false);
      }}
    >
      <div className="relative w-full max-w-2xl mx-4">
        <button
          onClick={() => setVisible(false)}
          aria-label="Close"
          className="absolute -top-4 -right-4 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white transition-colors shadow-lg"
        >
          <X className="w-4 h-4" />
        </button>
        <EmailCapture onSuccess={() => setVisible(false)} />
      </div>
    </div>
  );
}
