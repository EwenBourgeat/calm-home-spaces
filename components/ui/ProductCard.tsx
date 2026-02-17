import Image from "next/image";
import Link from "next/link";
import type { ProductRecord } from "@/lib/airtable";

interface ProductCardProps {
    product: ProductRecord;
}

/**
 * Product Card for the homepage grid.
 * Pinterest-style vertical card with rounded corners, shadow, and hover lift.
 */
export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link
            href={`/product/${product.id}`}
            className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
            {/* Image container — 3:4 aspect ratio for Pinterest-style vertical feel */}
            <div className="relative aspect-[3/4] overflow-hidden bg-cream-dark">
                <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Card body */}
            <div className="p-4">
                <h3 className="font-serif text-sm text-stone-800 leading-snug line-clamp-2">
                    {product.title}
                </h3>
                <p className="mt-1.5 text-xs text-stone-400 uppercase tracking-wider">
                    {product.category}
                </p>
            </div>
        </Link>
    );
}
