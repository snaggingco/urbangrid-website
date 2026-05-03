import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, lazy, Suspense } from "react";

// Eagerly loaded (always needed)
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import SEO from "@/components/SEO";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import ServiceDetail from "@/pages/ServiceDetail";

// Lazy-loaded pages (rarely visited or secondary)
const BlogDetail = lazy(() => import("@/pages/BlogDetail"));
const Careers = lazy(() => import("@/pages/Careers"));
const BrokerReferrals = lazy(() => import("@/pages/BrokerReferrals"));
const Login = lazy(() => import("@/pages/Login"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Lazy-loaded admin pages
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AddBlog = lazy(() => import("@/pages/admin/AddBlog"));
const ManageBlogs = lazy(() => import("@/pages/admin/ManageBlogs"));
const ManageInspectors = lazy(() => import("@/pages/admin/ManageInspectors"));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const isAdmin = isAuthenticated && user?.role === 'admin';
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
            <Route path="/services/:category/:slug" component={ServiceDetail} />

            <Route path="/blog" component={Blog} />
            <Route path="/blog/:slug" component={BlogDetail} />
            <Route path="/careers" component={Careers} />
            <Route path="/contact" component={Contact} />
            <Route path="/broker-referrals" component={BrokerReferrals} />
            <Route path="/login" component={Login} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route path="/terms-of-service" component={TermsOfService} />

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
