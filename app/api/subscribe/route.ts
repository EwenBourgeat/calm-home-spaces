import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 }
      );
    }

    const API_KEY = process.env.KIT_API_KEY;
    const FORM_ID = process.env.KIT_FORM_ID;

    if (!API_KEY || !FORM_ID) {
      console.error("Missing Kit API credentials");
      return NextResponse.json(
        { error: "Subscription service unavailable." },
        { status: 500 }
      );
    }

    // Verified Kit V4 Upsert Endpoint
    const response = await fetch("https://api.kit.com/v4/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Kit-Api-Key": API_KEY,
      },
      body: JSON.stringify({
        email_address: email,
        form_id: Number(FORM_ID),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle cases where subscriber already exists (often 422 or specific message in Kit)
      // Usually Kit V4 returns specific errors, but for the user UX we treat "already subscribed" as success
      if (data.error?.message?.toLowerCase().includes("already subscribed")) {
        return NextResponse.json({ success: true, message: "Already subscribed" });
      }
      
      throw new Error(data.error?.message || "Failed to connect to Kit");
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Newsletter Subscription Error:", error);
    return NextResponse.json(
      { error: `Subscription Error: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
