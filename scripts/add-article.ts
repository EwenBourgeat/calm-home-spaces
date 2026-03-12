import Airtable from "airtable";

// You must run this script with `npx tsx scripts/add-article.ts --title="..." ...`
const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
    console.error("Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID in environment.");
    process.exit(1);
}

const base = new Airtable({ apiKey }).base(baseId);
const TABLE_NAME = "Articles";

async function run() {
    const args = process.argv.slice(2);
    const data: Record<string, string> = {};

    // Basic arg parsing: --key="value"
    for (const arg of args) {
        if (arg.startsWith("--")) {
            const [key, value] = arg.slice(2).split("=");
            if (key && value) {
                data[key.replace(/-/g, "_")] = value; // e.g. --meta-description -> meta_description
            }
        }
    }

    if (!data.title || !data.content || !data.slug) {
        console.error("Missing required fields. Usage:");
        console.error('npx tsx scripts/add-article.ts --title="Title" --slug="art-slug" --content="Markdown content" [--subtitle="..."] [--category="..."]');
        process.exit(1);
    }

    console.log(`Adding new article: ${data.title}`);

    try {
        await base(TABLE_NAME).create([
            {
                fields: {
                    Titre_Article: data.title,
                    Subtitle: data.subtitle || "",
                    Category: data.category || "General",
                    Slug: data.slug,
                    Read_Time: data.read_time || "4 min read",
                    Meta_Description: data.meta_description || "",
                    Published_At: new Date().toISOString().split("T")[0],
                    Contenu: data.content,
                },
            },
        ]);
        console.log(`✅ Success: ${data.slug} added to Airtable!`);
    } catch (error) {
        console.error(`❌ Failed to add article:`, error);
    }
}

run();
