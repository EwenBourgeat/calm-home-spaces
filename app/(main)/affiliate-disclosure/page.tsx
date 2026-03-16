import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure — Calm Home Spaces",
  description: "Information about our affiliate relationships and how we earn commissions.",
};

export default function AffiliateDisclosure() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-4 bg-stone-50">
      <article className="mx-auto max-w-2xl bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-stone-200/60">
        <h1 className="font-serif text-3xl text-stone-900 mb-8 border-b border-stone-100 pb-6">
          Affiliate Disclosure
        </h1>
        
        <div className="prose prose-stone prose-sm max-w-none text-stone-600 leading-relaxed">
          <p className="mb-6">
            Everything we do at <strong>Calm Home Spaces</strong> is driven by our passion for beautiful, minimalist design and creating serene environments. To keep our content free and maintain our platform, we participate in various affiliate marketing programs.
          </p>

          <h2 className="text-lg font-medium text-stone-800 mb-4 mt-8">Amazon Associates Program</h2>
          <p className="mb-6">
            Calm Home Spaces is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.
          </p>
          <p className="mb-6 italic bg-stone-50 p-4 rounded-lg border-l-4 border-stone-200">
            "As an Amazon Associate, I earn from qualifying purchases."
          </p>

          <h2 className="text-lg font-medium text-stone-800 mb-4 mt-8">How it works</h2>
          <p className="mb-6">
            When you click on a link to a product we recommend and make a purchase, we may receive a small commission from the retailer. 
            <strong> This comes at no extra cost to you.</strong> The price you pay is exactly the same as if you had gone to the retailer directly.
          </p>

          <h2 className="text-lg font-medium text-stone-800 mb-4 mt-8">Our Integrity</h2>
          <p className="mb-6">
            We only recommend products that we genuinely love and feel fit the Calm Home Spaces aesthetic. Our editorial content is not influenced by our affiliate partnerships. We prioritize your trust and the quality of our curation above all else.
          </p>

          <div className="mt-12 pt-8 border-t border-stone-100 text-stone-400 text-[11px] uppercase tracking-wider">
            Last updated: March 2026
          </div>
        </div>
      </article>
    </div>
  );
}
