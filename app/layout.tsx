import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Header } from "@/components/ui/Header";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import "./globals.css";

// ===================================
// Font Configuration
// Playfair Display (Serif) → Titles: luxury editorial feel
// Inter (Sans-serif) → Body: maximum readability
// ===================================

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// ===================================
// Root Metadata (defaults, overridden per page)
// ===================================

export const metadata: Metadata = {
  title: {
    default: "Calm Home Spaces — Curated Home Decor",
    template: "%s | Calm Home Spaces",
  },
  description:
    "Discover beautifully curated home decor pieces. Handpicked lighting, furniture, and accessories for your calm, cozy living space.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://calmhomespaces.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Calm Home Spaces",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "p:domain_verify": "95dfd2ae32e229fcb10f2c450f8478e4",
  },
};

// ===================================
// Root Layout
// ===================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-cream text-stone-900 font-sans antialiased min-h-screen">
        <Header />
        <main>{children}</main>
        <Analytics />
        <SpeedInsights />

        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-379T9YTE1W"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-379T9YTE1W');
            `,
          }}
        />
      </body>
    </html>
  );
}
