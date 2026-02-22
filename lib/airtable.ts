import Airtable from "airtable";

// ==============================================
// TypeScript Interfaces
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
    parentProduct: string;
    colorVariant: string;
}

/** A product group bundles all color variants of the same parent product. */
export interface ProductGroup {
    /** Use the first variant's parentProduct as the group key */
    parentProduct: string;
    /** Display title (from the first variant) */
    title: string;
    category: string;
    /** All individual variant records */
    variants: ProductRecord[];
}

// ==============================================
// Airtable Client
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
// Generated Images from Pin (Post)
// ==============================================

async function getGeneratedImagesByProduct(): Promise<Map<string, ProductImage[]>> {
    const base = getBase();
    const result = new Map<string, ProductImage[]>();
    if (!base) return result;

    try {
        const records = await base(PINS_TABLE_NAME)
            .select({
                fields: ["Product", "Generated_Media"],
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

            const productId = productLinks[0];
            const images: ProductImage[] = media.map((img) => ({
                url: img.url,
                width: img.width || 896,
                height: img.height || 1152,
            }));

            const existing = result.get(productId) ?? [];
            result.set(productId, [...existing, ...images]);
        }
    } catch (error) {
        console.error("[Airtable] Failed to fetch generated images from Pin (Post):", error);
    }

    return result;
}

// ==============================================
// Record Mapping
// ==============================================

function mapRecord(
    record: Airtable.Record<Airtable.FieldSet>,
    generatedImages?: Map<string, ProductImage[]>
): ProductRecord | null {
    const fields = record.fields;

    const cleanTitle = fields["Clean_Title"] as string | undefined;
    const name = fields["Name"] as string | undefined;
    const title = cleanTitle || name;
    const description = fields["Clean_Description"] as string | undefined;
    const affiliateLink = fields["Affiliate_Link"] as string | undefined;
    const category = fields["Category"] as string | undefined;
    const subCategory = fields["Sub_Category"] as string | undefined;
    const priceUsd = fields["Price_USD"] as number | undefined;
    const parentProduct = fields["Parent_Product"] as string | undefined;
    const colorVariant = fields["Color_Variant"] as string | undefined;

    const media = fields["Product_Image"] as
        | Array<{ url: string; width?: number; height?: number }>
        | undefined;

    if (!title || !affiliateLink || !media || media.length === 0) {
        return null;
    }

    const originalImages: ProductImage[] = media.map((img) => ({
        url: img.url,
        width: img.width || 800,
        height: img.height || 1000,
    }));

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
        parentProduct: parentProduct || name || title,
        colorVariant: colorVariant || "",
    };
}

// ==============================================
// Grouping Logic
// ==============================================

/**
 * Groups an array of ProductRecords by their `parentProduct` field.
 * Products sharing the same `parentProduct` value are treated as color variants.
 * Products without a `colorVariant` remain standalone (group with 1 variant).
 */
export function groupProducts(products: ProductRecord[]): ProductGroup[] {
    const groupMap = new Map<string, ProductRecord[]>();

    for (const product of products) {
        const key = product.parentProduct;
        const existing = groupMap.get(key) ?? [];
        groupMap.set(key, [...existing, product]);
    }

    const groups: ProductGroup[] = [];
    for (const [parentProduct, variants] of groupMap) {
        const first = variants[0];
        groups.push({
            parentProduct,
            title: first.title,
            category: first.category,
            variants,
        });
    }

    return groups;
}

// ==============================================
// Data Fetching Functions (Server-Side Only)
// ==============================================

export async function getProduct(recordId: string): Promise<ProductRecord | null> {
    const base = getBase();
    if (!base) {
        console.warn("[Airtable] Missing API key or Base ID — returning null");
        return null;
    }

    try {
        const [generatedImages, record] = await Promise.all([
            getGeneratedImagesByProduct(),
            base(TABLE_NAME).find(recordId),
        ]);
        return mapRecord(record, generatedImages);
    } catch (error) {
        console.error(`[Airtable] Failed to fetch product ${recordId}:`, error);
        return null;
    }
}

export async function getAllProducts(): Promise<ProductRecord[]> {
    const base = getBase();
    if (!base) {
        console.warn("[Airtable] Missing API key or Base ID — returning empty array");
        return [];
    }

    try {
        const [generatedImages, records] = await Promise.all([
            getGeneratedImagesByProduct(),
            base(TABLE_NAME)
                .select({
                    sort: [{ field: "Name", direction: "asc" }],
                })
                .all(),
        ]);

        return records
            .map((r) => mapRecord(r, generatedImages))
            .filter((p): p is ProductRecord => p !== null);
    } catch (error) {
        console.error("[Airtable] Failed to fetch products:", error);
        return [];
    }
}

/**
 * Fetch all products and return them grouped by Parent_Product.
 * This is used by the homepage to show one card per product group.
 */
export async function getAllProductGroups(): Promise<ProductGroup[]> {
    const products = await getAllProducts();
    return groupProducts(products);
}

/**
 * Fetch all variants for a given Parent_Product name.
 * Used on the product detail page to show variant switcher.
 */
export async function getProductVariants(parentProduct: string): Promise<ProductRecord[]> {
    const allProducts = await getAllProducts();
    return allProducts.filter((p) => p.parentProduct === parentProduct);
}
