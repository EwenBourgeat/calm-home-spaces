"use client";

import { useEffect } from "react";

interface PinterestPageTrackerProps {
    eventName: "PageVisit" | "ViewContent";
    customData: {
        content_ids?: string[];
        content_name?: string;
        value?: number;
        currency?: string;
    };
}

/**
 * Fires an asynchronous request to our backend API route to securely log
 * the event to Pinterest CAPI, without breaking Next.js static rendering (ISR).
 */
export function PinterestPageTracker({ eventName, customData }: PinterestPageTrackerProps) {
    useEffect(() => {
        // Send the event once the page mounts on the client
        fetch("/api/track-view", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ eventName, customData }),
        }).catch((err) => console.error("Pinterest tracking error:", err));
        
        // Ensure this only fires once per page load
    }, [eventName, customData.content_name, customData.value]);

    return null;
}
