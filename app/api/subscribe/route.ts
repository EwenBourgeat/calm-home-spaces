import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "A valid email is required." },
        { status: 400 }
      );
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_LIST_ID = process.env.BREVO_LIST_ID;

    if (!BREVO_API_KEY || !BREVO_LIST_ID) {
      console.error("[Subscribe] Missing Brevo configuration");
      return NextResponse.json(
        { success: false, error: "Subscription service unavailable." },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        listIds: [parseInt(BREVO_LIST_ID, 10)],
        updateEnabled: true,
      }),
    });

    // 201 = created, 204 = no content (contact already existed and updated)
    if (response.status === 201 || response.status === 204) {
      return NextResponse.json({ success: true });
    }

    // Handle duplicate contact gracefully
    const data = await response.json().catch(() => ({}));
    if (
      response.status === 400 &&
      JSON.stringify(data).toLowerCase().includes("duplicate_parameter")
    ) {
      return NextResponse.json({ success: true });
    }

    // Any other error — log server-side only, never expose Brevo details to client
    console.error("[Subscribe] Brevo error:", response.status, data);
    return NextResponse.json(
      { success: false, error: "Could not join the newsletter. Please try again later." },
      { status: 500 }
    );
  } catch (error) {
    console.error("[Subscribe] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Could not join the newsletter. Please try again later." },
      { status: 500 }
    );
  }
}
