import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone-200/60 py-10 px-4 bg-white">
      <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link href="/" className="flex items-center gap-4 group">
            <img src="/logo.ico" alt="" className="w-10 h-10 object-contain" />
            <span className="font-serif text-xs tracking-[0.2em] text-stone-900 font-semibold group-hover:text-forest transition-colors">
              CALM HOME SPACES
            </span>
          </Link>
          <p className="text-[10px] text-stone-400 tracking-wider uppercase font-sans">
            Minimalist curation for serene living
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-[10px] text-stone-400 hover:text-stone-900 transition-colors uppercase tracking-widest font-medium"
            >
              Privacy Policy
            </Link>
            <Link
              href="/affiliate-disclosure"
              className="text-[10px] text-stone-400 hover:text-stone-900 transition-colors uppercase tracking-widest font-medium"
            >
              Affiliate Disclosure
            </Link>
          </div>
          <p className="text-[10px] text-stone-400 text-center md:text-right max-w-md leading-relaxed font-sans italic">
            As an Amazon Associate, we earn from qualifying purchases.
            <br />
            © {new Date().getFullYear()} Calm Home Spaces. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
