import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Header } from "@/components/ui/Header";
import { ExitIntentPopup } from "@/components/ui/ExitIntentPopup";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CookieBanner } from "@/components/ui/CookieBanner";
import Script from "next/script";
import { headers } from "next/headers";
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
  keywords: ["home decor", "Japandi", "Scandinavian design", "cozy interiors", "minimalist living", "interior design trends"],
  authors: [{ name: "Calm Home Spaces" }],
  creator: "Calm Home Spaces",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Calm Home Spaces",
    title: "Calm Home Spaces — Curated Home Decor",
    description: "Discover beautifully curated home decor pieces. Handpicked lighting, furniture, and accessories for your calm, cozy living space.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calm Home Spaces — Curated Home Decor",
    description: "Discover beautifully curated home decor pieces.",
    creator: "@calmhomespaces",
  },
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    "p:domain_verify": "95dfd2ae32e229fcb10f2c450f8478e4",
    "impact-site-verification": "8f97a22b-2f7d-4216-9699-3b2577c1aea3",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
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
        <ExitIntentPopup />
        <CookieBanner />
        <Analytics />
        <SpeedInsights />

        {/* Dynamic Client-side Analytics Trigger */}
        <Script id="analytics-consent-handler" strategy="afterInteractive">
          {`
            (function() {
              const consent = localStorage.getItem('calm_cookie_consent');
              if (consent === 'granted') {
                const gtagId = 'G-379T9YTE1W';
                const s = document.createElement('script');
                s.async = true;
                s.src = 'https://www.googletagmanager.com/gtag/js?id=' + gtagId;
                document.head.appendChild(s);

                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', gtagId, {
                  'anonymize_ip': true,
                  'cookie_flags': 'SameSite=None;Secure'
                });
              }
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
