import { QueryClientProvider } from "@tanstack/react-query";
import { renderToStaticMarkup } from "react-dom/server";
import { Router } from "wouter";
import Header from "@/components/Header";
import LondonHero from "@/components/first-paint/DubaiHero";
import HomeHero, { HomeStats } from "@/components/first-paint/HomeHero";
import { queryClient } from "@/lib/queryClient";

export function renderFirstPaint(path: string): string | undefined {
  if (path !== "/" && path !== "/locations/london") return undefined;

  const initialCounts = { inspections: 0, defects: 0, cities: 0 };
  const hero =
    path === "/" ? (
      <>
        <HomeHero />
        <HomeStats counts={initialCounts} />
      </>
    ) : (
      <LondonHero />
    );

  const markup = renderToStaticMarkup(
    <QueryClientProvider client={queryClient}>
      <Router ssrPath={path}>
          <div id="hero-skeleton" className="min-h-screen bg-white">
            <Header isAdmin={false} />
            <main id="main-content">
              {hero}
              <div aria-hidden="true" className="min-h-screen" />
            </main>
          </div>
      </Router>
    </QueryClientProvider>,
  );
  return markup
    // Keep early navigation/contact clicks until attribution and delegated
    // tracking are installed. This affects only the static preview, not React.
    .replace(/<(a|button|summary)\b/g, "<$1 inert")
    .replace(/(<form\b[^>]*>)/g, '$1<fieldset disabled style="display:contents">')
    .replace(/<\/form>/g, "</fieldset></form>");
}