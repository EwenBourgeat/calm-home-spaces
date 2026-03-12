import { NextResponse } from "next/server";
import { trackPinterestEvent } from "@/lib/pinterest-capi";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Extract Product details from body
        const { productId, title, priceUsd } = body;

        // Retrieve IP and User Agent securely for CAPI
        const clientIpAddress =
            request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            null;
        const clientUserAgent = request.headers.get("user-agent") || null;

        // Fire & forget event to Pinterest CAPI
        // Next.js Edge / Serverless functions will try to complete this before closing if we await it.
        // It's recommended to await it or use `event.waitUntil` (if Edge). Awaiting is safer for Vercel Serverless.
        await trackPinterestEvent({
            eventName: "Lead",
            clientIpAddress,
            clientUserAgent,
            customData: {
                content_ids: productId ? [productId] : undefined,
                content_name: title,
                value: priceUsd || undefined,
                currency: "USD",
            },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (_error) {
        // Fail silently so we don't return 500s that alarm the monitoring tools for non-critical analytics.
        return NextResponse.json({ success: false, reason: "Tracking failed" }, { status: 200 });
    }
}
