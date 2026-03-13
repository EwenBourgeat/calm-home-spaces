import { getAllProducts } from "../lib/airtable";

async function run() {
    console.log("Fetching products...");
    const products = await getAllProducts();
    for (const p of products.slice(0, 10)) {
        console.log(`Product: ${p.title}`);
        console.log(`- ImageUrl (active): ${p.imageUrl}`);
        console.log(`- Total Images: ${p.images.length}`);
    }
}
run();
