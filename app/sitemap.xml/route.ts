import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/airtable";
import { getAllArticles } from "@/lib/airtable-articles";

export const revalidate = 3600;

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://calmhomespaces.com';

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${baseUrl}/inspiration</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>${baseUrl}/shop</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>${baseUrl}/privacy</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
    </url>
`;

    try {
        const products = await getAllProducts();
        for (const product of products) {
            sitemap += `    <url>
        <loc>${baseUrl}/product/${product.id}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>\n`;
        }
    } catch (e) {
        console.error("Failed to fetch products for sitemap", e);
    }

    try {
        const articles = await getAllArticles();
        for (const article of articles) {
            const date = article.publishedAt ? new Date(article.publishedAt) : new Date();
            sitemap += `    <url>
        <loc>${baseUrl}/inspiration/${article.slug}</loc>
        <lastmod>${date.toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>\n`;
        }
    } catch (e) {
        console.error("Failed to fetch articles for sitemap", e);
    }

    sitemap += `</urlset>`;

    return new NextResponse(sitemap, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=86400, stale-while-revalidate",
        },
    });
}
