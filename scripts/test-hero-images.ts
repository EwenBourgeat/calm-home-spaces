import { getAllProducts } from "../lib/airtable";
import { getUniqueHeroImages, SLUG_RULES } from "../lib/article-utils";

async function run() {
    const allProducts = await getAllProducts();
    const slugs = Object.keys(SLUG_RULES);
    
    const heroImages = getUniqueHeroImages(
        slugs,
        allProducts,
        (p) => p.category,
        (p) => p.subCategory, // AirtableProduct has subCategory
        (p) => p.imageUrl,
        (p) => p.title
    );
    
    for (const slug of slugs) {
        console.log(`Slug: ${slug}`);
        console.log(`- Matched Hero URL: ${heroImages[slug]}`);
    }
}
run();
