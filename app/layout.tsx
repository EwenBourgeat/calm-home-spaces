import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Header } from "@/components/ui/Header";
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
      </body>
    </html>
  );
}
