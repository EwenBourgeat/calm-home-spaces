import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Footer } from "@/components/ui/Footer";
import Airtable from "airtable";

// Refresh every 5 minutes to ensure Airtable image signatures stay valid
export const revalidate = 300;

interface StarterProduct {
  id: string;
  number: string;
  title: string;
  description: string;
  link: string;
  image: string | null;
}

const STARTER_KIT_TITLES = [
  "Ceramic Rattan Table Lamp | Japandi Minimalist Decor",
  "Ceramic Vase Set | Japandi & Minimalist Home Decor",
  "Modern Ceramic Vases | Japandi Minimalist Decor",
  "Ceramic Vase Set | Minimalist Japandi Home Decor",
  "Minimalist Ceramic Planter Pot | Indoor Plant Decor",
  "Natural Linen Throw Pillows | Japandi Minimalist Decor",
  "Modern Table Lamp | Japandi Bedside Light & Minimalist Decor",
  "Floating Shelves | Japandi & Minimalist Decor Ideas",
  "Round Wood Mirror | Japandi & Minimalist Wall Decor",
  "Asymmetrical Wood Mirror | Minimalist & Japandi Decor",
];

async function getStarterKitProducts(): Promise<StarterProduct[]> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || "Products";

  if (!apiKey || !baseId) {
    console.error("[Starter Kit] Missing Airtable configuration");
    return [];
  }

  const base = new Airtable({ apiKey }).base(baseId);

  try {
    const filterFormula = `OR(${STARTER_KIT_TITLES.map(
      (title) => `{Clean_Title} = '${title.replace(/'/g, "\\'")}'`
    ).join(",")})`;

    const records = await base(tableName)
      .select({
        filterByFormula: filterFormula,
        fields: [
          "Clean_Title",
          "Clean_Description",
          "Affiliate_Link",
          "Product_Image",
        ],
      })
      .all();

    return STARTER_KIT_TITLES.map((title, index) => {
      const record = records.find((r) => r.fields["Clean_Title"] === title);
      if (!record) return null;

      const fields = record.fields;
      const productImages = fields["Product_Image"] as any[] | undefined;
      const image =
        productImages && productImages.length > 0
          ? productImages[0].thumbnails?.large?.url ||
            productImages[0].thumbnails?.full?.url ||
            productImages[0].url
          : null;

      return {
        id: record.id,
        number: (index + 1).toString().padStart(2, "0"),
        title: (fields["Clean_Title"] as string).split("|")[0].trim(),
        description: ((fields["Clean_Description"] as string) || "").slice(0, 100),
        link: fields["Affiliate_Link"] as string,
        image,
      };
    }).filter((p): p is StarterProduct => p !== null);
  } catch (error) {
    console.error("[Starter Kit] Data fetch failed:", error);
    return [];
  }
}

export const metadata: Metadata = {
  title: "The Japandi Starter Kit — 10 Essentials for a Calm Home",
  description:
    "Discover our curated selection of 10 affordable essentials to start your Japandi journey and create a serene, minimalist living space.",
  alternates: {
    canonical: "/japandi-starter-kit",
  },
};

export default async function StarterKitPage() {
  const products = await getStarterKitProducts();

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      {/* Minimalist Header */}
      <header className="py-8 px-4 flex flex-col items-center gap-4">
        <img src="/logo.ico" alt="" className="w-24 h-24 object-contain" />
        <Link
          href="/"
          className="font-serif text-lg tracking-[0.3em] text-stone-900 font-bold"
        >
          CALM HOME SPACES
        </Link>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-20 px-4 text-center">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stone-900 leading-tight mb-6">
            The Japandi <span className="italic">Starter Kit</span>
          </h1>
          <p className="text-stone-600 text-lg md:text-xl font-medium mb-4">
            10 affordable essentials to create a calm, minimal home
          </p>
          <p className="text-stone-500 text-base leading-relaxed max-w-lg mx-auto italic">
            Curated with care. Every piece under $80. Prime-eligible.
            <br className="hidden sm:block" />
            Everything you need to start your Japandi journey.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col group animate-fade-in-up"
              >
                {/* Product Image */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-stone-200 mb-5 shadow-sm group-hover:shadow-md transition-shadow duration-500">
                  {product.image && (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-grow flex flex-col px-1">
                  <span className="text-[10px] tracking-[0.2em] text-stone-400 font-semibold mb-1 block uppercase">
                    {product.number}
                  </span>
                  <h3 className="font-serif text-lg md:text-xl text-stone-900 mb-2 leading-snug">
                    {product.title}
                  </h3>
                  <p className="text-stone-500 text-sm mb-3 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="mt-auto pt-2">
                    <a
                      href={product.link}
                      target="_blank"
                      rel="nofollow sponsored"
                      className="inline-flex items-center gap-2 text-[10px] tracking-[0.1em] uppercase font-bold text-stone-900 hover:text-stone-600 transition-colors py-1 whitespace-nowrap"
                    >
                      Check Price on Amazon
                      <ArrowRight className="w-3 h-3" />
                    </a>
                    <div className="text-[8px] uppercase tracking-widest text-stone-300 mt-0.5">
                      affiliate link
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amazon Disclaimer */}
      <section className="px-4 py-12 border-t border-stone-200/50 bg-white/50">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] text-stone-400 italic leading-relaxed">
            As an Amazon Associate, I earn from qualifying purchases.
            <br />
            Prices are approximate and may vary.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-24 bg-white">
        <div className="mx-auto max-w-xl text-center p-12 rounded-[2.5rem] bg-stone-50 border border-stone-100 shadow-sm">
          <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto mb-6" />
          <h2 className="font-serif text-3xl text-stone-900 mb-4">
            Want more Japandi finds every week?
          </h2>
          <p className="text-stone-500 mb-10 leading-relaxed font-sans">
            Join our newsletter — new curated picks, styling tips, and calm
            home inspiration.
          </p>
          <Link
            href="/#subscribe"
            className="inline-block px-10 py-5 bg-stone-900 text-white text-xs tracking-[0.2em] uppercase font-semibold rounded-full hover:bg-forest transition-all duration-300 shadow-lg shadow-stone-200"
          >
            Join the newsletter
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
