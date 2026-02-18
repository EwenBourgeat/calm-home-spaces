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
const PINS_TABLE_NAME = "Pin (Post)";

function getBase() {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;

    if (!apiKey || !baseId) {
        return null;
    }

    return new Airtable({ apiKey }).base(baseId);
}

// ==============================================
// Generated Images — fetched from Pin (Post) table
// Returns a map: productRecordId → ProductImage[]
// Only includes pins that have a Generated_Media attachment.
// ==============================================

async function getGeneratedImagesByProduct(): Promise<Map<string, ProductImage[]>> {
    const base = getBase();
    const result = new Map<string, ProductImage[]>();
    if (!base) return result;

    try {
        const records = await base(PINS_TABLE_NAME)
            .select({
                fields: ["Product", "Generated_Media"],
                // Only fetch pins that have a generated image
                filterByFormula: "NOT({Generated_Media} = '')",
            })
            .all();

        for (const record of records) {
            const productLinks = record.fields["Product"] as string[] | undefined;
            const media = record.fields["Generated_Media"] as
                | Array<{ url: string; width?: number; height?: number }>
                | undefined;

            if (!productLinks || productLinks.length === 0 || !media || media.length === 0) {
                continue;
            }

            // A pin is linked to one product; take the first link
            const productId = productLinks[0];
            const images: ProductImage[] = media.map((img) => ({
                url: img.url,
                width: img.width || 896,
                height: img.height || 1152,
            }));

            // Accumulate images across multiple pins for the same product
            const existing = result.get(productId) ?? [];
            result.set(productId, [...existing, ...images]);
        }
    } catch (error) {
        console.error("[Airtable] Failed to fetch generated images from Pin (Post):", error);
    }

    return result;
}

/**
 * Maps a raw Airtable record to our typed ProductRecord.
 *
 * FIELD MAPPING (Airtable column → our interface):
 *   "Clean_Title"       → title (falls back to "Name" if empty)
 *   "Clean_Description" → description
 *   "Product_Image"     → imageUrl, imageWidth, imageHeight (fallback)
 *   "Affiliate_Link"    → amazonUrl
 *   "Category"          → category
 *   "Sub_Category"      → subCategory
 *   "Price_USD"         → price
 *   "Status"            → used for filtering only
 *
 * generatedImages: optional pre-fetched map of AI-generated images per product ID.
 * When provided and the product has generated images, those are used instead of Product_Image.
 *
 * Returns null if required fields (Clean_Title/Name, Affiliate_Link, Product_Image) are missing.
 */
function mapRecord(
    record: Airtable.Record<Airtable.FieldSet>,
    generatedImages?: Map<string, ProductImage[]>
): ProductRecord | null {
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

    // Fallback: original product images from the Products table
    const originalImages: ProductImage[] = media.map((img) => ({
        url: img.url,
        width: img.width || 800,
        height: img.height || 1000,
    }));

    // Prefer AI-generated images from Pin (Post) if available for this product
    const aiImages = generatedImages?.get(record.id);
    const allImages = aiImages && aiImages.length > 0 ? aiImages : originalImages;

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
        // Fetch generated images and the product record in parallel
        const [generatedImages, record] = await Promise.all([
            getGeneratedImagesByProduct(),
            base(TABLE_NAME).find(recordId),
        ]);
        return mapRecord(record, generatedImages);
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
        // Fetch generated images and all products in parallel
        const [generatedImages, records] = await Promise.all([
            getGeneratedImagesByProduct(),
            base(TABLE_NAME)
                .select({
                    sort: [{ field: "Name", direction: "asc" }],
                })
                .all(),
        ]);

        // Map and filter out any records with missing data
        return records
            .map((r) => mapRecord(r, generatedImages))
            .filter((p): p is ProductRecord => p !== null);
    } catch (error) {
        console.error("[Airtable] Failed to fetch products:", error);
        return [];
    }
}
