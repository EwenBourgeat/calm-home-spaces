"use client";

import { useState, useEffect } from "react";
import { X, Gift } from "lucide-react";
import { EmailCapture } from "./EmailCapture";

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only run on desktop
    if (window.innerWidth < 768) return;

    // Check if shown in current session
    const hasShown = sessionStorage.getItem("calm_exit_popup_shown");
    if (hasShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when mouse leaves the viewport towards the top
      if (e.clientY <= 0) {
        setIsOpen(true);
        sessionStorage.setItem("calm_exit_popup_shown", "true");
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" 
        onClick={() => setIsOpen(false)}
      />
      
      <div className="relative w-full max-w-xl bg-white rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-900 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-stone-100 rounded-lg text-stone-600">
              <Gift className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-semibold font-sans">
              Wait, don't leave empty handed
            </span>
          </div>

          <h2 className="font-serif text-3xl text-stone-900 mb-4 leading-tight">
            One last thing...
          </h2>
          <p className="text-stone-500 mb-8 font-sans leading-relaxed">
            Get our exclusive <span className="font-semibold text-stone-800 italic">Japandi Guide</span> before you go. Join 5,000+ others creating calm spaces.
          </p>

          <EmailCapture />
        </div>
      </div>
    </div>
  );
}
