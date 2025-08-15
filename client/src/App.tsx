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
import Login from "@/pages/Login";
import Dashboard from "@/pages/admin/Dashboard";
import AddBlog from "@/pages/admin/AddBlog";
import ManageBlogs from "@/pages/admin/ManageBlogs";
import NotFound from "@/pages/not-found";

// Location Pages
import Dubai from "@/pages/locations/Dubai";
import AbuDhabi from "@/pages/locations/AbuDhabi";
import Sharjah from "@/pages/locations/Sharjah";
import Ajman from "@/pages/locations/Ajman";
import RasAlKhaimah from "@/pages/locations/RasAlKhaimah";
import Fujairah from "@/pages/locations/Fujairah";
import UmmAlQuwain from "@/pages/locations/UmmAlQuwain";

// Dubai Location + Service Pages
import DubaiNewBuildSnagging from "@/pages/locations/dubai/new-build-snagging";
import DubaiVillaSnagging from "@/pages/locations/dubai/villa-snagging";
import DubaiApartmentInspection from "@/pages/locations/dubai/apartment-inspection";
import DubaiDLPSnagging from "@/pages/locations/dubai/dlp-snagging";

// Abu Dhabi Location + Service Pages
import AbuDhabiNewBuildSnagging from "@/pages/locations/abu-dhabi/new-build-snagging";
import AbuDhabiVillaSnagging from "@/pages/locations/abu-dhabi/villa-snagging";
import AbuDhabiApartmentInspection from "@/pages/locations/abu-dhabi/apartment-inspection";

// Sharjah Location + Service Pages
import SharjahNewBuildSnagging from "@/pages/locations/sharjah/new-build-snagging";
import SharjahVillaSnagging from "@/pages/locations/sharjah/villa-snagging";
import SharjahApartmentInspection from "@/pages/locations/sharjah/apartment-inspection";

// Components
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";

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
      <Header isAdmin={isAdmin} />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/services" component={Services} />
          <Route path="/services/:slug" component={ServiceDetail} />
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
