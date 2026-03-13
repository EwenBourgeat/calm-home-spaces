import { getArticleBySlug } from "../lib/airtable-articles";
import { getAllProducts } from "../lib/airtable";

async function run() {
    console.log("Fetching Japandi Living Room article...");
    const article = await getArticleBySlug("japandi-living-room");
    if (!article) {
        console.error("Article not found by slug");
        return;
    }
    console.log(`Article: ${article.title}`);
    console.log(`productReferences: ${JSON.stringify(article.productReferences)}`);

    const allProducts = await getAllProducts();
    console.log(`Total Products: ${allProducts.length}`);
    const sampleIds = allProducts.slice(0, 5).map(p => p.id);
    console.log(`Sample Product IDs: ${JSON.stringify(sampleIds)}`);

    const matched = allProducts.filter((p) => article.productReferences?.includes(p.id));
    console.log(`Matched Products count: ${matched.length}`);
}
run();
