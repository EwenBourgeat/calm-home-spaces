import { NextResponse } from "next/server";
import { trackPinterestEvent } from "@/lib/pinterest-capi";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Extract parameters
        const { eventName, customData } = body;

        // Retrieve IP and User Agent securely for CAPI
        const clientIpAddress =
            request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            null;
        const clientUserAgent = request.headers.get("user-agent") || null;

        // Fire event to Pinterest CAPI
        await trackPinterestEvent({
            eventName,
            clientIpAddress,
            clientUserAgent,
            customData,
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (_error) {
        // Fail silently
        return NextResponse.json({ success: false, reason: "Tracking failed" }, { status: 200 });
    }
}
