/**
 * Seed UrbanGrid inspection services as Stripe products.
 * Run once: npx tsx scripts/seed-products.ts
 * Idempotent — skips products that already exist.
 */

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load stripeClient from server directory
const { getUncachableStripeClient } = await import(path.join(__dirname, "../server/stripeClient.js")).catch(
  () => import(path.join(__dirname, "../server/stripeClient.ts"))
);

const SERVICES = [
  {
    name: "New Build Snagging",
    description: "Comprehensive pre-handover inspection for newly constructed properties in the UAE.",
    metadata: { serviceKey: "new-build-snagging", category: "property-snagging", pricingType: "tiered-sqft" },
  },
  {
    name: "Post-Renovation Inspection",
    description: "Thorough check after home improvements to ensure contractor quality.",
    metadata: { serviceKey: "post-renovation-inspection", category: "property-snagging", pricingType: "tiered-sqft" },
  },
  {
    name: "DLP Snagging",
    description: "Defects Liability Period inspection — conducted before the developer's 1-year warranty expires.",
    metadata: { serviceKey: "dlp-snagging", category: "property-snagging", pricingType: "desnagging" },
  },
  {
    name: "Move-In Move-Out Inspection",
    description: "Condition report for tenants and landlords to protect security deposits.",
    metadata: { serviceKey: "move-in-move-out", category: "property-snagging", pricingType: "flat-sqft" },
  },
  {
    name: "Secondary Market Inspection",
    description: "Pre-purchase inspection for resale properties to identify hidden defects.",
    metadata: { serviceKey: "secondary-market", category: "property-snagging", pricingType: "tiered-sqft" },
  },
];

async function seedProducts() {
  const stripe = await getUncachableStripeClient();
  console.log("Seeding UrbanGrid inspection services to Stripe...\n");

  for (const service of SERVICES) {
    const existing = await stripe.products.search({
      query: `name:'${service.name}' AND active:'true'`,
    });

    if (existing.data.length > 0) {
      console.log(`SKIP  ${service.name} — already exists (${existing.data[0].id})`);
      continue;
    }

    const product = await stripe.products.create({
      name: service.name,
      description: service.description,
      metadata: service.metadata,
    });

    console.log(`CREATED  ${product.name} — ${product.id}`);
  }

  console.log("\nDone. Products are now visible in your Stripe dashboard.");
  console.log("Prices are created dynamically at checkout based on property size.");
}

seedProducts().catch((err) => {
  console.error("Error seeding products:", err.message);
  process.exit(1);
});
