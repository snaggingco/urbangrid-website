/**
 * Seed UrbanGrid inspection services as Stripe Products + AED prices.
 * Run once after connecting your Stripe account:
 *   npx tsx scripts/seed-products.ts
 *
 * Idempotent — skips products/prices that already exist (matched by metadata.serviceKey).
 * Service keys MUST match CHECKOUT_SERVICES in server/routes.ts exactly.
 */

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { getUncachableStripeClient } = await import(
  path.join(__dirname, "../server/stripeClient.ts")
).catch(() => import(path.join(__dirname, "../server/stripeClient.js")));

// All 6 bookable services.
// startingPriceAed = the lowest possible price (smallest property / base tier).
// Actual checkout sessions use dynamic price_data based on Lena's quote.
const SERVICES = [
  {
    serviceKey: "new-build-snagging",
    name: "New Build Snagging Inspection",
    description:
      "Comprehensive pre-handover inspection for newly constructed UAE properties. Identifies defects before you accept the keys from the developer.",
    startingPriceAed: 840,
  },
  {
    serviceKey: "post-renovation-inspection",
    name: "Post-Renovation Inspection",
    description:
      "Thorough check after home improvements or contractor work. Ensures quality was delivered before final payment.",
    startingPriceAed: 840,
  },
  {
    serviceKey: "secondary-market-inspection",
    name: "Secondary Market Inspection",
    description:
      "Pre-purchase inspection for resale properties. Identifies hidden defects and gives you negotiating power.",
    startingPriceAed: 840,
  },
  {
    serviceKey: "de-snagging",
    name: "De-Snagging Verification Audit",
    description:
      "Confirms that defects identified in the original snagging report have been properly rectified by the developer.",
    startingPriceAed: 420,
  },
  {
    serviceKey: "dlp-inspection",
    name: "DLP 11th Month Inspection",
    description:
      "Defects Liability Period inspection — conducted before the developer's 1-year warranty expires.",
    startingPriceAed: 420,
  },
  {
    serviceKey: "move-in-move-out",
    name: "Move-In / Move-Out Inspection",
    description:
      "Condition report for tenants and landlords. Protects security deposits with a documented property state.",
    startingPriceAed: 840,
  },
] as const;

async function seedProducts() {
  const stripe = await getUncachableStripeClient();
  console.log("Seeding UrbanGrid inspection services to Stripe…\n");

  for (const svc of SERVICES) {
    // Check if a product with this serviceKey already exists
    const existing = await stripe.products.search({
      query: `metadata['serviceKey']:'${svc.serviceKey}'`,
    });

    let productId: string;

    if (existing.data.length > 0) {
      productId = existing.data[0].id;
      console.log(`SKIP  product: ${svc.name} (${productId})`);
    } else {
      const product = await stripe.products.create({
        name: svc.name,
        description: svc.description,
        metadata: {
          serviceKey: svc.serviceKey,
          category: "property-inspection",
          pricingType: "dynamic-sqft",
          market: "UAE",
        },
      });
      productId = product.id;
      console.log(`CREATE product: ${svc.name} → ${productId}`);
    }

    // Check if a starting-price in AED already exists for this product
    const prices = await stripe.prices.list({ product: productId, active: true });
    const aedPrice = prices.data.find(
      (p) => p.currency === "aed" && p.metadata?.priceType === "starting"
    );

    if (aedPrice) {
      console.log(
        `SKIP  price:   AED ${svc.startingPriceAed} starting price (${aedPrice.id})`
      );
    } else {
      const price = await stripe.prices.create({
        product: productId,
        currency: "aed",
        unit_amount: svc.startingPriceAed * 100, // fils (1 AED = 100 fils)
        metadata: {
          serviceKey: svc.serviceKey,
          priceType: "starting",
          note: "Starting price only. Actual charge is calculated per sq.ft by Lena AI and verified server-side via HMAC.",
        },
      });
      console.log(
        `CREATE price:   AED ${svc.startingPriceAed} starting → ${price.id}`
      );
    }

    console.log();
  }

  console.log("Done. All 6 bookable services are now in your Stripe dashboard.");
  console.log(
    "Actual checkout sessions charge the Lena-quoted amount (verified by HMAC)."
  );
}

seedProducts().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
