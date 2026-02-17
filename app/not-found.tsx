import Link from "next/link";
import { Home } from "lucide-react";

/**
 * Custom 404 page — shown when a product has been removed from Airtable
 * or when a user navigates to a non-existent route.
 *
 * Design: calm, reassuring, with a clear path back to the homepage.
 */
export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                {/* Decorative "404" */}
                <p className="font-serif text-8xl text-stone-200 mb-4 select-none">
                    404
                </p>

                {/* Heading */}
                <h1 className="font-serif text-2xl md:text-3xl text-stone-800 mb-3">
                    Oups, ce produit n&apos;est plus disponible
                </h1>

                {/* Explanation */}
                <p className="text-stone-500 text-sm leading-relaxed mb-8">
                    Il se peut que cet article ait été retiré de notre sélection ou que le
                    lien soit incorret. Découvrez nos autres pièces soigneusement
                    sélectionnées.
                </p>

                {/* CTA — Back to homepage */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-forest text-cream px-6 py-3 rounded-full text-sm font-medium tracking-wide hover:bg-forest-light transition-all duration-300 hover:shadow-lg"
                >
                    <Home className="w-4 h-4" />
                    Retour à l&apos;accueil
                </Link>

                {/* Branding */}
                <p className="mt-12 font-serif text-xs tracking-[0.2em] text-stone-300">
                    CALM HOME SPACES
                </p>
            </div>
        </div>
    );
}
