import Airtable from "airtable";

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;
const base = new Airtable({ apiKey: apiKey as string }).base(baseId as string);

async function run() {
    console.log("Fetching articles with all fields...");
    const records = await base("Articles").select({ maxRecords: 10 }).firstPage();
    if(records.length > 0) {
      records.forEach(r => {
          console.log(`Article: ${r.fields["Titre_Article"]} (${r.fields["Slug"]})`);
          console.log(`- References_Produit keys: ${Object.keys(r.fields).filter(k => k.includes("Produit"))}`);
          console.log(`- References_Produit value: ${JSON.stringify(r.fields["References_Produit"])}`);
          console.log(`- All fields: ${JSON.stringify(Object.keys(r.fields))}`);
          console.log("---");
      });
    } else {
      console.log("No articles found");
    }
}
run();
