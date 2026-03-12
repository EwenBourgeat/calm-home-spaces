import { NextResponse } from "next/server";

// ==============================================
// GET /api/products
// Returns enriched products from Airtable filtered by
// Enrichment_Status = "Done" AND Affiliate_Link not empty.
// Cache: 1 hour with stale-while-revalidate.
// ==============================================

interface AirtableAttachment {
    id: string;
    url: string;
    width?: number;
    height?: number;
    thumbnails?: {
        small?: { url: string; width: number; height: number };
        large?: { url: string; width: number; height: number };
        full?: { url: string; width: number; height: number };
    };
}

interface AirtableProductFields {
    Clean_Title?: string;
    Name?: string;
    Category?: string;
    Sub_Category?: string;
    Price_USD?: number;
    Color_Variant?: string;
    Affiliate_Link?: string;
    Product_Image?: AirtableAttachment[];
    Enrichment_Status?: string;
}

interface ProductAPIResponse {
    id: string;
    clean_title: string;
    category: string;
    sub_category: string;
    price_usd: number | null;
    color_variant: string;
    bridge_url: string;
    product_image_url: string;
}

export async function GET() {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME || "Products";

    if (!apiKey || !baseId) {
        return NextResponse.json(
            { error: "Server configuration error", products: [] },
            { status: 503 }
        );
    }

    try {
        const products: ProductAPIResponse[] = [];
        let offset: string | undefined;

        // Airtable paginates at 100 records — loop until no more offset
        do {
            const params = new URLSearchParams({
                filterByFormula: 'AND({Enrichment_Status} = "Done", {Affiliate_Link} != "")',
                "fields[]": [
                    "Clean_Title",
                    "Name",
                    "Category",
                    "Sub_Category",
                    "Price_USD",
                    "Color_Variant",
                    "Product_Image",
                ].join(","),
                "sort[0][field]": "Clean_Title",
                "sort[0][direction]": "asc",
            });

            // fields[] needs to be repeated for each field in Airtable REST API
            // Rebuild params properly
            const url = new URL(
                `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`
            );
            url.searchParams.set(
                "filterByFormula",
                'AND({Enrichment_Status} = "Done", {Affiliate_Link} != "")'
            );
            const fieldNames = [
                "Clean_Title",
                "Name",
                "Category",
                "Sub_Category",
                "Price_USD",
                "Color_Variant",
                "Product_Image",
            ];
            for (const field of fieldNames) {
                url.searchParams.append("fields[]", field);
            }
            url.searchParams.set("sort[0][field]", "Clean_Title");
            url.searchParams.set("sort[0][direction]", "asc");

            if (offset) {
                url.searchParams.set("offset", offset);
            }

            const response = await fetch(url.toString(), {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
                // Next.js fetch cache — revalidate every hour server-side
                next: { revalidate: 3600 },
            });

            if (!response.ok) {
                console.error(
                    `[API Products] Airtable returned ${response.status}: ${response.statusText}`
                );
                return NextResponse.json(
                    { error: "unavailable", products: [] },
                    { status: 503 }
                );
            }

            const data = await response.json();

            for (const record of data.records || []) {
                const fields = record.fields as AirtableProductFields;
                const title = fields.Clean_Title || fields.Name;
                const images = fields.Product_Image;

                if (!title || !images || images.length === 0) {
                    continue;
                }

                // Prefer thumbnails.large.url, fallback to main url
                const firstImage = images[0];
                const imageUrl =
                    firstImage.thumbnails?.large?.url || firstImage.url;

                products.push({
                    id: record.id,
                    clean_title: title,
                    category: fields.Category || "Decor",
                    sub_category: fields.Sub_Category || "",
                    price_usd: fields.Price_USD ?? null,
                    color_variant: fields.Color_Variant || "",
                    bridge_url: `/product/${record.id}`,
                    product_image_url: imageUrl,
                });
            }

            offset = data.offset;
        } while (offset);

        return NextResponse.json(products, {
            status: 200,
            headers: {
                "Cache-Control":
                    "public, s-maxage=3600, stale-while-revalidate=600",
            },
        });
    } catch (error) {
        console.error("[API Products] Unexpected error:", error);
        return NextResponse.json(
            { error: "unavailable", products: [] },
            { status: 503 }
        );
    }
}
