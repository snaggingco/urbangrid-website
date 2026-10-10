import assert from "node:assert/strict";
import express from "express";
import { registerUkPublicPages } from "../server/ukPublicPages";
import { ukPublicPaths, ukPageSeo } from "../shared/ukSeo";
import { generateSitemap, getSitemapUrls } from "../server/sitemap";
import { regionalAlternates } from "../shared/regionalSeo";

const app = express();
app.get("/sitemap.xml", (_req, res) => res.type("application/xml").send(generateSitemap(getSitemapUrls("https://urbangrid.co.uk", []))));
registerUkPublicPages(app);
const server = app.listen(0, "127.0.0.1");
await new Promise<void>(resolve => server.once("listening", resolve));
const base = `http://127.0.0.1:${(server.address() as any).port}`;
try {
  const titles = new Set(), descriptions = new Set();
  for (const route of ukPublicPaths) {
    const response = await fetch(base + route), html = await response.text();
    assert.equal(response.status, 200, route);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `${route}: one visible heading`);
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1, `${route}: one canonical`);
    assert(html.includes(`href="https://urbangrid.co.uk${route}"`), route);
    assert(html.includes(ukPageSeo(route)!.noindex ? 'content="noindex, follow"' : 'content="index, follow"'), route);
    const title = html.match(/<title>(.*?)<\/title>/)![1];
    const description = html.match(/name="description" content="([^"]+)"/)![1];
    assert(!titles.has(title), `${route}: unique title`); titles.add(title);
    assert(!descriptions.has(description), `${route}: unique description`); descriptions.add(description);
    for (const {language, href} of regionalAlternates(route, "GB")) assert(html.includes(`hreflang="${language}" href="${href}"`), route);
    for (const script of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(script[1]);
    assert(!/\b(?:dirhams|Dubai|RERA certified|40,000)\b/.test(html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]*>/g, " ")), `${route}: no inherited market claims`);
  }
  const sitemap = await (await fetch(base + "/sitemap.xml")).text();
  assert(!sitemap.includes("urbangrid.ae"));
  for (const route of ukPublicPaths) assert.equal(sitemap.includes(`<loc>https://urbangrid.co.uk${route}</loc>`), !ukPageSeo(route)!.noindex, route);
  assert.equal((await fetch(base + "/missing-seo-test-page")).status, 404);
  assert((await (await fetch(base + "/robots.txt")).text()).includes("Sitemap: https://urbangrid.co.uk/sitemap.xml"));
  console.log(`PASS: ${ukPublicPaths.length} UK public routes, content, unique metadata, canonicals, hreflang, schema, sitemap exclusions and real 404.`);
} finally { server.close(); }
