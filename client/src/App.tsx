import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, lazy, Suspense } from "react";
import { CartProvider } from "@/lib/cartStore";
import { captureAttribution } from "@/lib/attribution";
import AdminAccess from "@/components/admin/AdminAccess";
import { getDubaiPage, loadDubaiPage } from "@/lib/publicRoutePreload";

// Eagerly loaded (shell always needed)
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import ConsentBanner from "@/components/ConsentBanner";
import SEO from "@/components/SEO";
import Home from "@/pages/Home";

// Lazy-loaded pages — each becomes its own chunk, reducing initial bundle by ~60%
const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const SampleReport = lazy(() => import("@/pages/SampleReport"));
const ServiceDetail = lazy(() => import("@/pages/ServiceDetail"));
const AssetTagging = lazy(() => import("@/pages/AssetTagging"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogDetail = lazy(() => import("@/pages/BlogDetail"));
const Contact = lazy(() => import("@/pages/Contact"));
const Careers = lazy(() => import("@/pages/Careers"));
const BrokerReferrals = lazy(() => import("@/pages/BrokerReferrals"));
const Login = lazy(() => import("@/pages/Login"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const CheckoutSuccess = lazy(() => import("@/pages/CheckoutSuccess"));
const CheckoutCancel = lazy(() => import("@/pages/CheckoutCancel"));
const BookInspection = lazy(() => import("@/pages/BookInspection"));
const BookingReturn = lazy(() => import("@/pages/BookingReturn"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Lazy-loaded location pages
const LazyDubai = lazy(loadDubaiPage);
function LocationDubai() {
  const Page = getDubaiPage();
  return Page ? <Page /> : <LazyDubai />;
}
const LocationAbuDhabi = lazy(() => import("@/pages/locations/AbuDhabi"));
const LocationSharjah = lazy(() => import("@/pages/locations/Sharjah"));
const LocationAjman = lazy(() => import("@/pages/locations/Ajman"));
const LocationRasAlKhaimah = lazy(() => import("@/pages/locations/RasAlKhaimah"));
const LocationFujairah = lazy(() => import("@/pages/locations/Fujairah"));
const LocationUmmAlQuwain = lazy(() => import("@/pages/locations/UmmAlQuwain"));

// Lazy-loaded admin pages
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AddBlog = lazy(() => import("@/pages/admin/AddBlog"));
const ManageBlogs = lazy(() => import("@/pages/admin/ManageBlogs"));
const ManageInspectors = lazy(() => import("@/pages/admin/ManageInspectors"));
const VisibilityDashboard = lazy(() => import("@/pages/admin/VisibilityDashboard"));
const ManageLeads = lazy(() => import("@/pages/admin/ManageLeads"));
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const Bookings = lazy(() => import("@/pages/admin/Bookings"));
const Acquisition = lazy(() => import("@/pages/admin/Acquisition"));

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
            <Route path="/sample-report" component={SampleReport} />
            <Route path="/services/asset-tagging-inventory" component={AssetTagging} />
            <Route path="/services/:category/:slug" component={ServiceDetail} />

            <Route path="/blog" component={Blog} />
            <Route path="/blog/:slug" component={BlogDetail} />

            <Route path="/locations/dubai" component={LocationDubai} />
            <Route path="/locations/abu-dhabi" component={LocationAbuDhabi} />
            <Route path="/locations/sharjah" component={LocationSharjah} />
            <Route path="/locations/ajman" component={LocationAjman} />
            <Route path="/locations/ras-al-khaimah" component={LocationRasAlKhaimah} />
            <Route path="/locations/fujairah" component={LocationFujairah} />
            <Route path="/locations/umm-al-quwain" component={LocationUmmAlQuwain} />

            <Route path="/careers" component={Careers} />
            <Route path="/contact" component={Contact} />
            <Route path="/broker-referrals" component={BrokerReferrals} />
            <Route path="/login" component={Login} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route path="/terms-of-service" component={TermsOfService} />

            <Route path="/book-inspection/return" component={BookingReturn} />
            <Route path="/book-inspection" component={BookInspection} />
            <Route path="/checkout/success" component={CheckoutSuccess} />
            <Route path="/checkout/cancel" component={CheckoutCancel} />

            <Route path="/admin/login" component={AdminLogin} />
            <Route path="/admin"><AdminAccess><Dashboard /></AdminAccess></Route>
            <Route path="/admin/add-blog"><AdminAccess><AddBlog /></AdminAccess></Route>
            <Route path="/admin/manage-blogs"><AdminAccess><ManageBlogs /></AdminAccess></Route>
            <Route path="/admin/manage-inspectors"><AdminAccess><ManageInspectors /></AdminAccess></Route>
            <Route path="/admin/visibility"><AdminAccess><VisibilityDashboard /></AdminAccess></Route>
            <Route path="/admin/leads"><AdminAccess><ManageLeads /></AdminAccess></Route>
            <Route path="/admin/bookings"><AdminAccess><Bookings /></AdminAccess></Route>
            <Route path="/admin/acquisition"><AdminAccess><Acquisition /></AdminAccess></Route>
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
        <CartProvider>
          <Toaster />
          <Router />
          <ConsentBanner />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
