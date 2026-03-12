import Airtable from "airtable";
import { InspirationArticle } from "../data/inspiration-articles";

// ==============================================
// Airtable Client for Articles
// ==============================================

const TABLE_NAME = "Articles"; // Ensure this exactly matches the table in Airtable

function getBase() {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;

    if (!apiKey || !baseId) {
        return null;
    }

    return new Airtable({ apiKey }).base(baseId);
}

// ==============================================
// Record Mapping
// ==============================================

function mapArticleRecord(record: Airtable.Record<Airtable.FieldSet>): InspirationArticle | null {
    const fields = record.fields;

    const slug = fields["Slug"] as string | undefined;
    const title = fields["Titre_Article"] as string | undefined;
    const subtitle = fields["Subtitle"] as string | undefined;
    const category = fields["Category"] as string | undefined;
    const readTime = fields["Read_Time"] as string | undefined;
    const metaDescription = fields["Meta_Description"] as string | undefined;
    const publishedAt = fields["Published_At"] as string | undefined;
    const content = fields["Contenu"] as string | undefined;
    const productReferences = fields["References_Produit"] as string[] | undefined;

    if (!slug || !title || !content) {
        return null; // A valid article needs at least these
    }

    return {
        slug,
        title,
        subtitle: subtitle || "",
        category: category || "General",
        readTime: readTime || "5 min read",
        metaDescription: metaDescription || "",
        heroImage: null, // Removed hero image logic if relying on products later
        publishedAt: publishedAt || new Date().toISOString().split("T")[0],
        content,
        relatedSlugs: [], // Keeping empty since Airtable doesn't explicitly link them yet unless added
        // We add a specific references array for runtime use
        productReferences: productReferences || [],
    };
}

// ==============================================
// Data Fetching Functions
// ==============================================

export async function getAllArticles(): Promise<InspirationArticle[]> {
    const base = getBase();
    if (!base) {
        console.warn("[Airtable Articles] Missing API key or Base ID — returning empty array");
        return [];
    }

    try {
        const records = await base(TABLE_NAME)
            .select({
                sort: [{ field: "Published_At", direction: "desc" }], // Show newest first
            })
            .all();

        return records
            .map(mapArticleRecord)
            .filter((a): a is InspirationArticle => a !== null);
    } catch (error) {
        console.error("[Airtable Articles] Failed to fetch articles:", error);
        return [];
    }
}

export async function getArticleBySlug(slug: string): Promise<InspirationArticle | null> {
    const base = getBase();
    if (!base) return null;

    try {
        const records = await base(TABLE_NAME)
            .select({
                filterByFormula: `{Slug} = '${slug}'`,
                maxRecords: 1,
            })
            .all();

        if (records.length === 0) return null;
        return mapArticleRecord(records[0]);
    } catch (error) {
        console.error(`[Airtable Articles] Failed to fetch article ${slug}:`, error);
        return null;
    }
}
