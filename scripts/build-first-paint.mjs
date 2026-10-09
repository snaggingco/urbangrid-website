// Build-only rendering of public, anonymous components. No database, auth,
// booking submissions or environment credentials are used.
import fs from "node:fs/promises";
import path from "node:path";
import { createServer } from "vite";

const publicDir = path.resolve("dist/public");
const manifest = JSON.parse(await fs.readFile(path.join(publicDir, ".vite/manifest.json"), "utf8"));
const assets = new Map();
for (const [source, entry] of Object.entries(manifest)) {
  assets.set(path.basename(source), entry.file);
  if (entry.name) assets.set(entry.name, entry.file);
}
const vite = await createServer({
  configFile: path.resolve("vite.config.ts"),
  mode: "production",
  server: { middlewareMode: true, hmr: false },
  optimizeDeps: { noDiscovery: true, include: [] },
  appType: "custom",
});
try {
  const { renderFirstPaint } = await vite.ssrLoadModule("/src/firstPaint.tsx");
  const pages = {};
  for (const route of ["/", "/locations/london"]) {
    const markup = renderFirstPaint(route);
    if (!markup) throw new Error("Public first-paint rendering failed");
    pages[route] = markup.replace(/src="([^"]+)"/g, (tag, url) => {
      if (!url.startsWith("/@fs/") && !url.startsWith("/src/") && !url.startsWith("/attached_assets/")) return tag;
      const asset = assets.get(path.basename(decodeURIComponent(url)));
      if (!asset) throw new Error("First-paint asset was not found in the build manifest");
      return `src="/${asset}"`;
    });
  }
  await fs.writeFile(path.join(publicDir, "first-paint.json"), JSON.stringify(pages));
  console.log("Generated shared public first-paint markup for homepage and London.");
} finally {
  await vite.close();
}