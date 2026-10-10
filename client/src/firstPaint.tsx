import { QueryClientProvider } from "@tanstack/react-query";
import { renderToStaticMarkup } from "react-dom/server";
import { Router, Route, Switch } from "wouter";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Pricing from "@/pages/Pricing";
import Contact from "@/pages/Contact";
import ServiceDetail from "@/pages/ServiceDetail";
import AssetTagging from "@/pages/AssetTagging";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import Footer from "@/components/Footer";
import { ukPublicPaths } from "@shared/ukSeo";
import Header from "@/components/Header";
import LondonHero from "@/components/first-paint/DubaiHero";
import HomeHero, { HomeStats } from "@/components/first-paint/HomeHero";
import { queryClient } from "@/lib/queryClient";

export function renderFirstPaint(path: string): string | undefined {
  if (!ukPublicPaths.includes(path)) return undefined;

  const initialCounts = { inspections: 0, defects: 0, cities: 0 };
  const hero =
    path === "/" ? (
      <>
        <HomeHero />
        <HomeStats counts={initialCounts} />
      </>
    ) : path === "/locations/london" ? <LondonHero /> : (
      <Switch>
        <Route path="/about" component={About} />
        <Route path="/services" component={Services} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/contact" component={Contact} />
        <Route path="/services/asset-tagging-inventory" component={AssetTagging} />
        <Route path="/services/:category/:slug" component={ServiceDetail} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/blog"><section className="pt-36 pb-20 px-10"><h1>Property Inspection Resources</h1><p>Approved UK guidance will be published here when available.</p></section></Route>
      </Switch>
    );

  const markup = renderToStaticMarkup(
    <QueryClientProvider client={queryClient}>
      <Router ssrPath={path}>
          <div id="hero-skeleton" className="min-h-screen bg-white">
            <Header isAdmin={false} />
            <main id="main-content">
              {hero}
              {path === "/" || path === "/locations/london" ? <div aria-hidden="true" className="min-h-screen" /> : null}
            </main>
            <Footer />
          </div>
      </Router>
    </QueryClientProvider>,
  );
  return markup.replace(/opacity:0(?=;|")/g, "opacity:1")
    // Keep early navigation/contact clicks until attribution and delegated
    // tracking are installed. This affects only the static preview, not React.
    .replace(/<(a|button|summary)\b/g, "<$1 inert")
    .replace(/(<form\b[^>]*>)/g, '$1<fieldset disabled style="display:contents">')
    .replace(/<\/form>/g, "</fieldset></form>");
}