import "server-only";

type PinterestEventName = "PageVisit" | "ViewContent" | "Lead" | "AddToCart" | "Checkout";

interface PinterestEventData {
    eventName: PinterestEventName;
    clientIpAddress: string | null;
    clientUserAgent: string | null;
    customData?: {
        content_ids?: string[];
        content_name?: string;
        value?: number;
        currency?: string;
    };
}

/**
 * Tracks an event using the Pinterest API v5 (Server-Side).
 * Fails silently so it never blocks page rendering or user flow.
 */
export async function trackPinterestEvent(data: PinterestEventData) {
    try {
        const { PINTEREST_ACCESS_TOKEN, PINTEREST_AD_ACCOUNT_ID } = process.env;

        // Features flag: if no tokens, skip tracking (e.g., local dev)
        if (!PINTEREST_ACCESS_TOKEN || !PINTEREST_AD_ACCOUNT_ID) {
            console.warn("Pinterest CAPI skipped: Missing API tokens.");
            return;
        }

        const endpoint = `https://api.pinterest.com/v5/ad_accounts/${PINTEREST_AD_ACCOUNT_ID}/events`;

        // UUID v4 for deduplication (native to Node.js / Vercel Edge)
        const eventId = crypto.randomUUID();
        const eventTime = Math.floor(Date.now() / 1000); // Unix timestamp in seconds

        // Construct the strict payload requested by Pinterest API
        const payload = {
            data: [
                {
                    event_name: data.eventName,
                    action_source: "web",
                    event_time: eventTime,
                    event_id: eventId,
                    user_data: {
                        client_ip_address: data.clientIpAddress || "unknown",
                        client_user_agent: data.clientUserAgent || "unknown",
                    },
                    ...(data.customData && { custom_data: data.customData }),
                },
            ],
        };

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${PINTEREST_ACCESS_TOKEN}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error(
                `Pinterest CAPI Error (${response.status}):`,
                errorData
            );
        }
    } catch (error) {
        // Silently catch network errors or other exceptions
        console.error("Pinterest CAPI Failed to execute:", error);
    }
}
