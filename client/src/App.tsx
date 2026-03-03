import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

// Pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import Contact from "@/pages/Contact";
import Careers from "@/pages/Careers";
import BrokerReferrals from "@/pages/BrokerReferrals";
import Login from "@/pages/Login";
import Dashboard from "@/pages/admin/Dashboard";
import AddBlog from "@/pages/admin/AddBlog";
import ManageBlogs from "@/pages/admin/ManageBlogs";
import ManageInspectors from "@/pages/admin/ManageInspectors";
import NotFound from "@/pages/not-found";

// Location Pages
import Ajman from "@/pages/locations/Ajman";
import RasAlKhaimah from "@/pages/locations/RasAlKhaimah";
import Fujairah from "@/pages/locations/Fujairah";
import UmmAlQuwain from "@/pages/locations/UmmAlQuwain";
import Dubai from "@/pages/locations/Dubai";
import AbuDhabi from "@/pages/locations/AbuDhabi";
import Sharjah from "@/pages/locations/Sharjah";

// Components
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import SEO from "@/components/SEO";

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
      <SEO />
      <Header isAdmin={isAdmin} />
      <main>
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
          <Route path="/careers" component={Careers} />
          <Route path="/contact" component={Contact} />
          <Route path="/broker-referrals" component={BrokerReferrals} />
          
          {/* Location Pages */}
          <Route path="/locations/dubai" component={Dubai} />
          <Route path="/locations/abu-dhabi" component={AbuDhabi} />
          <Route path="/locations/sharjah" component={Sharjah} />
          <Route path="/locations/ajman" component={Ajman} />
          <Route path="/locations/ras-al-khaimah" component={RasAlKhaimah} />
          <Route path="/locations/fujairah" component={Fujairah} />
          <Route path="/locations/umm-al-quwain" component={UmmAlQuwain} />

          {/* SEO Redirects / Aliases */}
          <Route path="/locations/dubai/snagging-company" component={Dubai} />
          <Route path="/locations/abu-dhabi/snagging-company" component={AbuDhabi} />
          <Route path="/locations/sharjah/snagging-company" component={Sharjah} />
          <Route path="/locations/dubai/property-inspection" component={Dubai} />
          <Route path="/locations/abu-dhabi/property-inspection" component={AbuDhabi} />
          <Route path="/locations/dubai/snagging-cost" component={Dubai} />
          <Route path="/locations/abu-dhabi/snagging-cost" component={AbuDhabi} />
          <Route path="/locations/sharjah/snagging-cost" component={Sharjah} />

          {/* Admin routes - protected for authenticated admin users */}
          {isAdmin && (
            <>
              <Route path="/admin" component={Dashboard} />
              <Route path="/admin/add-blog" component={AddBlog} />
              <Route path="/admin/manage-blogs" component={ManageBlogs} />
              <Route path="/admin/manage-inspectors" component={ManageInspectors} />
            </>
          )}
          <Route component={NotFound} />
        </Switch>
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
