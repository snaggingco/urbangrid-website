import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";

// Pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import Contact from "@/pages/Contact";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/admin/Dashboard";
import AddBlog from "@/pages/admin/AddBlog";
import ManageBlogs from "@/pages/admin/ManageBlogs";
import NotFound from "@/pages/not-found";

// Components
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const isAdmin = user?.role === 'admin';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {isAuthenticated ? (
        <>
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
        </>
      ) : (
        <Switch>
          <Route path="/" component={Landing} />
          <Route component={Landing} />
        </Switch>
      )}
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
