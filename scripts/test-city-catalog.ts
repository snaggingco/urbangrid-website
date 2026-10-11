import assert from "node:assert/strict";
import { ukCityPages, ukLocationPaths } from "../shared/ukLocations";
import { ukPublicPaths, ukPageSeo } from "../shared/ukSeo";
import { getSitemapUrls } from "../server/sitemap";
const known = new Set();
assert(ukCityPages.length >= 25);
for(const c of ukCityPages) {
  assert(!known.has(c.slug)); known.add(c.slug);
  assert(ukPublicPaths.includes("/locations/" + c.slug));
  const meta = ukPageSeo("/locations/" + c.slug);
  assert(meta && !meta.noindex && meta.title.includes(c.name) && meta.description.includes(c.region));
  assert(!/office in|local branch|guaranteed inspector/i.test(meta.description));
}
for(const p of ukLocationPaths) assert(getSitemapUrls("",[]).some(x=>x.loc === "https://urbangrid.co.uk"+p));
assert(getSitemapUrls("",[]).some(x=>x.loc==="https://urbangrid.co.uk/locations/london"));
console.log("PASS UK city catalogue, unique routes and country-specific sitemap");
