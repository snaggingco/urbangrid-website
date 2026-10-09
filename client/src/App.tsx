import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, lazy, Suspense } from "react";
import { captureAttribution } from "@/lib/attribution";
import AdminAccess from "@/components/admin/AdminAccess";

// Eagerly loaded (shell always needed)
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import SEO from "@/components/SEO";
import Home from "@/pages/Home";

// Lazy-loaded pages — each becomes its own chunk, reducing initial bundle by ~60%
const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const ServiceDetail = lazy(() => import("@/pages/ServiceDetail"));
const AssetTagging = lazy(() => import("@/pages/AssetTagging"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogDetail = lazy(() => import("@/pages/BlogDetail"));
const Contact = lazy(() => import("@/pages/Contact"));
const Login = lazy(() => import("@/pages/Login"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const NotFound = lazy(() => import("@/pages/not-found"));

// This is the existing location-page component, adapted to the verified UK coverage.
const LondonCoverage = lazy(() => import("@/pages/locations/Dubai"));

// Lazy-loaded admin pages
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AddBlog = lazy(() => import("@/pages/admin/AddBlog"));
const ManageBlogs = lazy(() => import("@/pages/admin/ManageBlogs"));
const ManageLeads = lazy(() => import("@/pages/admin/ManageLeads"));
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" role="status" aria-label="Loading page">
      <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Router() {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = isAuthenticated && user?.role === 'admin';
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    captureAttribution();
  }, [location]);

  return (
    <div className="min-h-screen bg-white">
      <SEO />
      <Header isAdmin={isAdmin} />
      <main id="main-content">
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/services" component={Services} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/services/asset-tagging-inventory" component={AssetTagging} />
            <Route path="/services/:category/:slug" component={ServiceDetail} />

            <Route path="/blog" component={Blog} />
            <Route path="/blog/:slug" component={BlogDetail} />

            <Route path="/locations/london" component={LondonCoverage} />

            <Route path="/contact" component={Contact} />
            <Route path="/login" component={Login} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route path="/terms-of-service" component={TermsOfService} />

            <Route path="/book-inspection/return"><Redirect to="/contact" /></Route>
            <Route path="/book-inspection"><Redirect to="/contact" /></Route>
            <Route path="/checkout/success"><Redirect to="/contact" /></Route>
            <Route path="/checkout/cancel"><Redirect to="/contact" /></Route>
            <Route path="/checkout"><Redirect to="/contact" /></Route>

            <Route path="/admin/login" component={AdminLogin} />
            <Route path="/admin"><AdminAccess><Dashboard /></AdminAccess></Route>
            <Route path="/admin/add-blog"><AdminAccess><AddBlog /></AdminAccess></Route>
            <Route path="/admin/manage-blogs"><AdminAccess><ManageBlogs /></AdminAccess></Route>
            <Route path="/admin/leads"><AdminAccess><ManageLeads /></AdminAccess></Route>
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
