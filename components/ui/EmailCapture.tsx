"use client";

import { useState } from "react";
import { Send, Leaf, Loader2 } from "lucide-react";

interface EmailCaptureProps {
  onSuccess?: () => void;
}

export function EmailCapture({ onSuccess }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        onSuccess?.();
      } else {
        throw new Error(data.error || "Something went wrong");
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="w-full max-w-2xl mx-auto p-12 bg-forest/5 rounded-3xl border border-forest/10 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-forest/10 mb-6">
          <Leaf className="w-8 h-8 text-forest" />
        </div>
        <h3 className="font-serif text-2xl text-stone-900 mb-4">Welcome to the Calm Club</h3>
        <p className="text-forest/80 font-medium">
          You&apos;re in! Check your inbox for your Japandi Starter Kit 🌿
        </p>
      </div>
    );
  }

  return (
    <section className="w-full max-w-4xl mx-auto my-20 px-4">
      <div className="relative overflow-hidden bg-stone-900 rounded-[2.5rem] p-8 md:p-16 shadow-2xl">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800 border border-stone-700 mb-6">
            <Leaf className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium">
              Free Digital Guide
            </span>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-white mb-6 leading-tight">
            Get Your Free{" "}
            <span className="italic text-stone-400">Japandi Essentials</span> Guide
          </h2>

          <p className="text-stone-400 text-lg mb-10 leading-relaxed font-sans">
            10 curated products for a calm, minimal home — delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-grow px-6 py-4 rounded-full bg-stone-800 border border-stone-700 text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-600 transition-all font-sans"
                disabled={status === "loading"}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-8 py-4 bg-white text-stone-900 rounded-full font-semibold text-xs uppercase tracking-[0.15em] hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2 group whitespace-nowrap"
              >
                {status === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Send me the guide</span>
                    <Send className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {status === "error" && (
              <p className="text-red-400 text-sm font-sans">{errorMsg}</p>
            )}
          </form>

          <div className="mt-10 pt-8 border-t border-white/10">
            <p className="text-[11px] text-stone-500 leading-relaxed font-sans">
              No spam. Unsubscribe anytime.{" "}
              <span className="italic">
                As an Amazon Associate, I earn from qualifying purchases.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
