import fs from "node:fs";
import path from "node:path";

import { ukPublicPaths } from "@shared/ukSeo";
const firstPaintRoutes = new Set(ukPublicPaths);
let builtPages: Record<string, string> | undefined;

export function injectFirstPaint(html: string, pathname: string, rendered?: string) {
  const route = pathname.replace(/\/$/, "") || "/";
  if (!firstPaintRoutes.has(route)) return html;
  if (rendered === undefined) {
    builtPages ??= JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, "public", "first-paint.json"), "utf8"));
    rendered = builtPages![route];
  }
  if (!rendered) throw new Error("Public first-paint markup is missing");
  if (!html.includes("<!-- public-root:start -->") || !html.includes("<!-- public-root:end -->")) {
    throw new Error("Public first-paint root markers are missing");
  }
  return html.replace(
    /<!-- public-root:start -->[\s\S]*?<!-- public-root:end -->/,
    () => `<!-- public-root:start --><div id="root">${rendered}</div><!-- public-root:end -->`,
  );
}

export function preloadDubaiRoute(html: string, pathname: string) {
  if (!firstPaintRoutes.has(pathname)) return html;
  const assets = path.resolve(import.meta.dirname, "public", "assets");
  const files = fs.readdirSync(assets);
  const fonts = ["400", "700"].map(weight => {
    const font = files.find(name => name.startsWith(`inter-latin-${weight}-normal-`) && name.endsWith(".woff2"));
    if (!font) throw new Error("Public first-paint font is missing");
    return `<link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/${font}">`;
  });
  if (pathname === "/locations/london") {
    const chunk = files.find(name => /^Dubai-[\w-]+\.js$/.test(name));
    if (!chunk) throw new Error("London public route chunk is missing");
    fonts.push(`<link rel="modulepreload" crossorigin href="/assets/${chunk}">`);
  }
  return html.replace("</head>", `${fonts.join("\n")}\n</head>`);
}