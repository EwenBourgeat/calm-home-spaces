import Airtable from "airtable";
import { getAllArticles } from "../data/inspiration-articles";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
    console.error("Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID in .env.local");
    process.exit(1);
}

const base = new Airtable({ apiKey }).base(baseId);
const TABLE_NAME = "Articles";

async function migrate() {
    console.log("Starting migration of articles to Airtable...");
    const localArticles = getAllArticles();

    for (const article of localArticles) {
        try {
            console.log(`Migrating: ${article.title}`);
            
            // Check if article already exists by slug
            const existingRecords = await base(TABLE_NAME)
                .select({
                    filterByFormula: `{Slug} = '${article.slug}'`,
                    maxRecords: 1,
                })
                .all();

            const fields = {
                "Titre_Article": article.title,
                "Contenu": article.content,
                "Slug": article.slug,
                "Subtitle": article.subtitle,
                "Category": article.category,
                "Read_Time": article.readTime,
                "Meta_Description": article.metaDescription,
                "Published_At": article.publishedAt,
                // "References_Produit": article.productReferences || [], // Handled separately or as string IDs
            };

            if (existingRecords.length > 0) {
                console.log(`Updating existing record for ${article.slug}`);
                await base(TABLE_NAME).update(existingRecords[0].id, fields);
            } else {
                console.log(`Creating new record for ${article.slug}`);
                await base(TABLE_NAME).create([
                    {
                        fields: fields
                    }
                ]);
            }
        } catch (error) {
            console.error(`Error migrating ${article.title}:`, error);
        }
    }

    console.log("Migration finished!");
}

migrate();
