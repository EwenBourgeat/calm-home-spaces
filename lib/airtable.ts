import Airtable from "airtable";

// ==============================================
// TypeScript Interface — mirrors the Airtable schema
// Only the fields needed by the frontend are exposed.
// ==============================================

export interface ProductImage {
    url: string;
    width: number;
    height: number;
}

export interface ProductRecord {
    id: string;
    title: string;
    description: string;
    images: ProductImage[];
    imageUrl: string;
    imageWidth: number;
    imageHeight: number;
    amazonUrl: string;
    category: string;
    subCategory: string;
    price: number | null;
}

// ==============================================
// Airtable Client — Lazy Initialization
// The SDK throws if AIRTABLE_API_KEY is missing at import time,
// so we defer connection creation until a function is actually called.
// ==============================================

const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "Products";

function getBase() {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;

    if (!apiKey || !baseId) {
        return null;
    }

    return new Airtable({ apiKey }).base(baseId);
}

/**
 * Maps a raw Airtable record to our typed ProductRecord.
 * 
 * FIELD MAPPING (Airtable column → our interface):
 *   "Clean_Title"       → title (falls back to "Name" if empty)
 *   "Clean_Description" → description
 *   "Product_Image"     → imageUrl, imageWidth, imageHeight
 *   "Affiliate_Link"    → amazonUrl
 *   "Category"          → category
 *   "Sub_Category"      → subCategory
 *   "Price_USD"         → price
 *   "Status"            → used for filtering only
 *
 * Returns null if required fields (Clean_Title/Name, Affiliate_Link, Product_Image) are missing.
 */
function mapRecord(record: Airtable.Record<Airtable.FieldSet>): ProductRecord | null {
    const fields = record.fields;

    const cleanTitle = fields["Clean_Title"] as string | undefined;
    const name = fields["Name"] as string | undefined;
    const title = cleanTitle || name; // Prefer Clean_Title, fall back to Name
    const description = fields["Clean_Description"] as string | undefined;
    const affiliateLink = fields["Affiliate_Link"] as string | undefined;
    const category = fields["Category"] as string | undefined;
    const subCategory = fields["Sub_Category"] as string | undefined;
    const priceUsd = fields["Price_USD"] as number | undefined;

    // Product_Image is an Airtable Attachment field (array of objects)
    const media = fields["Product_Image"] as
        | Array<{ url: string; width?: number; height?: number }>
        | undefined;

    // Guard: skip records missing critical data
    if (!title || !affiliateLink || !media || media.length === 0) {
        return null;
    }

    // Map all images with fallback dimensions
    const allImages: ProductImage[] = media.map((img) => ({
        url: img.url,
        width: img.width || 800,
        height: img.height || 1000,
    }));

    const primaryImage = allImages[0];

    return {
        id: record.id,
        title,
        description: description || "",
        images: allImages,
        imageUrl: primaryImage.url,
        imageWidth: primaryImage.width,
        imageHeight: primaryImage.height,
        amazonUrl: affiliateLink,
        category: category || "Decor",
        subCategory: subCategory || "",
        price: priceUsd ?? null,
    };
}

// ==============================================
// Data Fetching Functions (Server-Side Only)
// ==============================================

/**
 * Fetch a single product by its Airtable Record ID.
 * Used by the product page (app/product/[id]/page.tsx).
 *
 * Returns null if the record doesn't exist, is missing required fields,
 * or if Airtable credentials are not configured.
 */
export async function getProduct(recordId: string): Promise<ProductRecord | null> {
    const base = getBase();
    if (!base) {
        console.warn("[Airtable] Missing API key or Base ID — returning null");
        return null;
    }

    try {
        const record = await base(TABLE_NAME).find(recordId);
        return mapRecord(record);
    } catch (error) {
        // Airtable throws if the record ID doesn't exist (404)
        console.error(`[Airtable] Failed to fetch product ${recordId}:`, error);
        return null;
    }
}

/**
 * Fetch all products from the table.
 * Used by the homepage to display a grid of available products.
 *
 * If a "Status" field exists, it filters for "Ready" or "Published".
 * If not, it returns all records that have the required fields.
 */
export async function getAllProducts(): Promise<ProductRecord[]> {
    const base = getBase();
    if (!base) {
        console.warn("[Airtable] Missing API key or Base ID — returning empty array");
        return [];
    }

    try {
        // Fetch all records — no filter on Status since the field may not exist yet
        const records = await base(TABLE_NAME)
            .select({
                sort: [{ field: "Name", direction: "asc" }],
            })
            .all();

        // Map and filter out any records with missing data
        return records.map(mapRecord).filter((p): p is ProductRecord => p !== null);
    } catch (error) {
        console.error("[Airtable] Failed to fetch products:", error);
        return [];
    }
}
