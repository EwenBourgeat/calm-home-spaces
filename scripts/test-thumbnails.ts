import Airtable from "airtable";
const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;
const base = new Airtable({ apiKey: apiKey as string }).base(baseId as string);

async function run() {
    console.log("Fetching first product...");
    const records = await base("Products").select({ maxRecords: 1 }).firstPage();
    console.log(JSON.stringify(records[0].fields["Product_Image"], null, 2));

    const pinRecords = await base("Pin (Post)").select({ maxRecords: 1, filterByFormula: "NOT({Generated_Media} = '')" }).firstPage();
    if(pinRecords.length > 0) {
      console.log(JSON.stringify(pinRecords[0].fields["Generated_Media"], null, 2));
    }
}
run();
