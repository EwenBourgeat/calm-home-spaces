"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Cookie, ShieldCheck } from "lucide-react";

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("calm_cookie_consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleConsent = (agreed: boolean) => {
    localStorage.setItem("calm_cookie_consent", agreed ? "granted" : "denied");
    setShowBanner(false);
    // Reload to trigger script loading if needed, or use a state manager
    window.location.reload();
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-[200] md:max-w-md animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-stone-100 rounded-lg text-stone-600">
              <Cookie className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-semibold font-sans">
              Privacy Settings
            </span>
          </div>

          <h3 className="font-serif text-xl text-stone-900 mb-3">
            We value your serenity
          </h3>
          <p className="text-stone-500 text-sm mb-6 leading-relaxed font-sans">
            We use cookies to enhance your experience and analyze our traffic. 
            By clicking "Accept All", you consent to our use of cookies. Read our{" "}
            <Link href="/privacy" className="underline hover:text-stone-900">
              Privacy Policy
            </Link>.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleConsent(true)}
              className="w-full py-4 bg-stone-900 text-white rounded-full font-semibold text-xs uppercase tracking-[0.15em] hover:bg-forest transition-all shadow-lg flex items-center justify-center gap-2 group"
            >
              <ShieldCheck className="w-4 h-4" />
              Accept All
            </button>
            <button
              onClick={() => handleConsent(false)}
              className="w-full py-4 bg-white text-stone-500 border border-stone-200 rounded-full font-semibold text-xs uppercase tracking-[0.15em] hover:bg-stone-50 transition-all"
            >
              Essential Only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
