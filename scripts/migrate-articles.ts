import Airtable from "airtable";
import { getAllArticles } from "../data/inspiration-articles";

// Use environment variables or hardcode for local script execution
// You must run this script with `npx tsx scripts/migrate-articles.ts`
const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
    console.error("Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID in environment.");
    process.exit(1);
}

const base = new Airtable({ apiKey }).base(baseId);
const TABLE_NAME = "Articles";

async function run() {
    const articles = getAllArticles();
    console.log(`Found ${articles.length} articles to migrate...`);

    for (const article of articles) {
        console.log(`Migrating: ${article.title}`);

        try {
            await base(TABLE_NAME).create([
                {
                    fields: {
                        Titre_Article: article.title,
                        Subtitle: article.subtitle,
                        Category: article.category,
                        Slug: article.slug,
                        Read_Time: article.readTime,
                        Meta_Description: article.metaDescription,
                        Published_At: article.publishedAt,
                        Contenu: article.content,
                        // References_Produit is intentionally left blank here
                        // as we don't have the Airtable record IDs for the products 
                        // in the static file. You can link them manually later.
                    },
                },
            ]);
            console.log(`✅ Success: ${article.slug}`);
        } catch (error) {
            console.error(`❌ Failed to migrate ${article.slug}:`, error);
        }
    }

    console.log("Migration complete!");
}

run();
