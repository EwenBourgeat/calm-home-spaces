import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://calmhomespaces.com';
    const content = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;

    return new NextResponse(content, {
        headers: {
            "Content-Type": "text/plain",
            "Cache-Control": "public, max-age=86400, stale-while-revalidate",
        },
    });
}
