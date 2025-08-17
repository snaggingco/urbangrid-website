import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, lazy, Suspense } from "react";

// Critical pages (loaded immediately)
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

// Lazy load non-critical pages
const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const ServiceDetail = lazy(() => import("@/pages/ServiceDetail"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogDetail = lazy(() => import("@/pages/BlogDetail"));
const Contact = lazy(() => import("@/pages/Contact"));
const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AddBlog = lazy(() => import("@/pages/admin/AddBlog"));
const ManageBlogs = lazy(() => import("@/pages/admin/ManageBlogs"));

// Lazy load location pages
const Dubai = lazy(() => import("@/pages/locations/Dubai"));
const AbuDhabi = lazy(() => import("@/pages/locations/AbuDhabi"));
const Sharjah = lazy(() => import("@/pages/locations/Sharjah"));
const Ajman = lazy(() => import("@/pages/locations/Ajman"));
const RasAlKhaimah = lazy(() => import("@/pages/locations/RasAlKhaimah"));
const Fujairah = lazy(() => import("@/pages/locations/Fujairah"));
const UmmAlQuwain = lazy(() => import("@/pages/locations/UmmAlQuwain"));

// Lazy load Dubai Location + Service Pages
const DubaiNewBuildSnagging = lazy(() => import("@/pages/locations/dubai/new-build-snagging"));
const DubaiVillaSnagging = lazy(() => import("@/pages/locations/dubai/villa-snagging"));
const DubaiApartmentInspection = lazy(() => import("@/pages/locations/dubai/apartment-inspection"));
const DubaiDLPSnagging = lazy(() => import("@/pages/locations/dubai/dlp-snagging"));

// Lazy load Abu Dhabi Location + Service Pages
const AbuDhabiNewBuildSnagging = lazy(() => import("@/pages/locations/abu-dhabi/new-build-snagging"));
const AbuDhabiVillaSnagging = lazy(() => import("@/pages/locations/abu-dhabi/villa-snagging"));
const AbuDhabiApartmentInspection = lazy(() => import("@/pages/locations/abu-dhabi/apartment-inspection"));

// Lazy load Sharjah Location + Service Pages
const SharjahNewBuildSnagging = lazy(() => import("@/pages/locations/sharjah/new-build-snagging"));
const SharjahVillaSnagging = lazy(() => import("@/pages/locations/sharjah/villa-snagging"));
const SharjahApartmentInspection = lazy(() => import("@/pages/locations/sharjah/apartment-inspection"));

// Lazy load Dubai High-Priority SEO Pages
const PropertySnaggingDubai = lazy(() => import("@/pages/locations/dubai/property-snagging"));
const SnaggingCostDubai = lazy(() => import("@/pages/locations/dubai/snagging-cost"));
const PropertySnaggingServicesDubai = lazy(() => import("@/pages/locations/dubai/property-snagging-services"));
const PrePurchaseInspectionDubai = lazy(() => import("@/pages/locations/dubai/pre-purchase-inspection"));

// Lazy load Abu Dhabi High-Priority SEO Pages
const PropertyInspectionAbuDhabi = lazy(() => import("@/pages/locations/abu-dhabi/property-inspection"));

// Components
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import SEO from "@/components/SEO";
import PerformanceOptimizer from "@/components/PerformanceOptimizer";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const isAdmin = isAuthenticated && user?.role === 'admin';
  const [location] = useLocation();

  // Scroll to top whenever the route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PerformanceOptimizer />
      <SEO />
      <Header isAdmin={isAdmin} />
      <main>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
          </div>
        }>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
          <Route path="/services" component={Services} />
          {/* Service Detail Routes - All 16 Services */}
          <Route path="/services/:category/:slug" component={ServiceDetail} />

          {/* Property Snagging Services (6 services) */}
          <Route path="/services/property-snagging/new-build-snagging" component={ServiceDetail} />
          <Route path="/services/property-snagging/post-renovation-inspection" component={ServiceDetail} />
          <Route path="/services/property-snagging/dlp-snagging" component={ServiceDetail} />
          <Route path="/services/property-snagging/move-in-move-out" component={ServiceDetail} />
          <Route path="/services/property-snagging/secondary-market" component={ServiceDetail} />
          <Route path="/services/property-snagging/developer-projects" component={ServiceDetail} />

          {/* RERA Services (5 services) */}
          <Route path="/services/rera-services/reserve-fund-study" component={ServiceDetail} />
          <Route path="/services/rera-services/service-charge-allocation" component={ServiceDetail} />
          <Route path="/services/rera-services/reinstatement-cost-assessment" component={ServiceDetail} />
          <Route path="/services/rera-services/building-completion-audit" component={ServiceDetail} />
          <Route path="/services/rera-services/building-condition-survey" component={ServiceDetail} />

          {/* Technical Inspections (5 services) */}
          <Route path="/services/technical-inspections/technical-due-diligence" component={ServiceDetail} />
          <Route path="/services/technical-inspections/dilapidation-survey" component={ServiceDetail} />
          <Route path="/services/technical-inspections/thermographic-survey" component={ServiceDetail} />
          <Route path="/services/technical-inspections/noise-survey" component={ServiceDetail} />
          <Route path="/services/technical-inspections/structural-survey" component={ServiceDetail} />

          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogDetail} />
          <Route path="/contact" component={Contact} />
          {/* Location Pages */}
          <Route path="/locations/dubai" component={Dubai} />
          <Route path="/locations/abu-dhabi" component={AbuDhabi} />
          <Route path="/locations/sharjah" component={Sharjah} />
          <Route path="/locations/ajman" component={Ajman} />
          <Route path="/locations/ras-al-khaimah" component={RasAlKhaimah} />
          <Route path="/locations/fujairah" component={Fujairah} />
          <Route path="/locations/umm-al-quwain" component={UmmAlQuwain} />

          {/* Dubai Location + Service Pages */}
          <Route path="/locations/dubai/new-build-snagging" component={DubaiNewBuildSnagging} />
          <Route path="/locations/dubai/villa-snagging" component={DubaiVillaSnagging} />
          <Route path="/locations/dubai/apartment-inspection" component={DubaiApartmentInspection} />
          <Route path="/locations/dubai/dlp-snagging" component={DubaiDLPSnagging} />

          {/* Abu Dhabi Location + Service Pages */}
          <Route path="/locations/abu-dhabi/new-build-snagging" component={AbuDhabiNewBuildSnagging} />
          <Route path="/locations/abu-dhabi/villa-snagging" component={AbuDhabiVillaSnagging} />
          <Route path="/locations/abu-dhabi/apartment-inspection" component={AbuDhabiApartmentInspection} />

          {/* Sharjah Location + Service Pages */}
          <Route path="/locations/sharjah/new-build-snagging" component={SharjahNewBuildSnagging} />
          <Route path="/locations/sharjah/villa-snagging" component={SharjahVillaSnagging} />
          <Route path="/locations/sharjah/apartment-inspection" component={SharjahApartmentInspection} />

          {/* High-Priority SEO Pages - Dubai */}
          <Route path="/locations/dubai/property-snagging" component={PropertySnaggingDubai} />
          <Route path="/locations/dubai/snagging-cost" component={SnaggingCostDubai} />
          <Route path="/locations/dubai/property-snagging-services" component={PropertySnaggingServicesDubai} />
          <Route path="/locations/dubai/pre-purchase-inspection" component={PrePurchaseInspectionDubai} />

          {/* High-Priority SEO Pages - Abu Dhabi */}
          <Route path="/locations/abu-dhabi/property-inspection" component={PropertyInspectionAbuDhabi} />
          {/* Admin routes - protected for authenticated admin users */}
          {isAdmin && (
            <>
              <Route path="/admin" component={Dashboard} />
              <Route path="/admin/add-blog" component={AddBlog} />
              <Route path="/admin/manage-blogs" component={ManageBlogs} />
            </>
          )}
          <Route component={NotFound} />
        </Switch>
        </Suspense>
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;