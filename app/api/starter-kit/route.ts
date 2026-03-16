import { NextResponse } from "next/server";
import Airtable from "airtable";

export const revalidate = 3600; // Cache for 1 hour

const STARTER_KIT_TITLES = [
  "Ceramic Rattan Table Lamp | Japandi Minimalist Decor",
  "Ceramic Vase Set | Japandi & Minimalist Home Decor",
  "Modern Ceramic Vases | Japandi Minimalist Decor",
  "Ceramic Vase Set | Minimalist Japandi Home Decor",
  "Minimalist Ceramic Planter Pot | Indoor Plant Decor",
  "Natural Linen Throw Pillows | Japandi Minimalist Decor",
  "Modern Table Lamp | Japandi Bedside Light & Minimalist Decor",
  "Floating Shelves | Japandi & Minimalist Decor Ideas",
  "Round Wood Mirror | Japandi & Minimalist Wall Decor",
  "Asymmetrical Wood Mirror | Minimalist & Japandi Decor"
];

export async function GET() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || "Products";

  if (!apiKey || !baseId) {
    return NextResponse.json({ error: "Missing Airtable configuration" }, { status: 500 });
  }

  const base = new Airtable({ apiKey }).base(baseId);

  try {
    // Build filter formula to get only the specific 10 products
    const filterFormula = `OR(${STARTER_KIT_TITLES.map(title => `{Clean_Title} = '${title.replace(/'/g, "\\'")}'`).join(",")})`;

    const records = await base(tableName).select({
      filterByFormula: filterFormula,
      fields: ["Clean_Title", "Clean_Description", "Price_USD", "Affiliate_Link", "Product_Image"]
    }).all();

    // Map and maintain the order of STARTER_KIT_TITLES
    const formattedProducts = STARTER_KIT_TITLES.map((title, index) => {
      const record = records.find(r => r.fields["Clean_Title"] === title);
      if (!record) return null;

      const fields = record.fields;
      const images = fields["Product_Image"] as any[];
      
      return {
        id: record.id,
        number: (index + 1).toString().padStart(2, '0'),
        title: (fields["Clean_Title"] as string).split("|")[0].trim(),
        description: (fields["Clean_Description"] as string || "").slice(0, 100),
        price: fields["Price_USD"] as number,
        link: fields["Affiliate_Link"] as string,
        image: images && images.length > 0 ? images[0].url : null
      };
    }).filter(p => p !== null);

    return NextResponse.json(formattedProducts);
  } catch (error: any) {
    console.error("[Starter Kit API] Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
