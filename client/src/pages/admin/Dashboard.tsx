import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { BlogPostWithAuthor } from "@shared/schema";

interface DashboardStats {
  totalPosts: number;
  draftPosts: number;
  publishedPosts: number;
}

interface BlogResponse {
  posts: BlogPostWithAuthor[];
  total: number;
}

export default function Dashboard() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      toast({
        title: "Unauthorized",
        description: "You need admin access to view this page. Redirecting to login...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/stats"],
    retry: false,
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: recentPosts, isLoading: postsLoading, error: postsError } = useQuery<BlogResponse>({
    queryKey: ["/api/admin/blog"],
    retry: false,
    enabled: isAuthenticated && user?.role === 'admin',
  });

  // Handle unauthorized errors
  useEffect(() => {
    if (statsError && isUnauthorizedError(statsError as Error)) {
      toast({
        title: "Session Expired",
        description: "Your session has expired. Redirecting to login...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [statsError, toast]);

  if (isLoading || (!isAuthenticated || user?.role !== 'admin')) {
    return (
      <div className="pt-16 lg:pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-light-grey">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Navigation */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-black mb-2">
            Admin Dashboard
          </h1>
          <p className="text-text-grey mb-6">
            Welcome back, {user?.firstName}! Manage your blog content and view statistics.
          </p>
          
          {/* Admin Navigation */}
          <nav className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <Link href="/admin">
              <a className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                location === '/admin' 
                  ? 'bg-brand-green text-white' 
                  : 'text-text-grey hover:text-brand-green hover:bg-gray-100'
              }`}>
                <i className="fas fa-home mr-2"></i>
                Dashboard
              </a>
            </Link>
            <Link href="/admin/add-blog">
              <a className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                location === '/admin/add-blog' 
                  ? 'bg-brand-green text-white' 
                  : 'text-text-grey hover:text-brand-green hover:bg-gray-100'
              }`}>
                <i className="fas fa-plus mr-2"></i>
                Add Blog
              </a>
            </Link>
            <Link href="/admin/manage-blogs">
              <a className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                location === '/admin/manage-blogs' 
                  ? 'bg-brand-green text-white' 
                  : 'text-text-grey hover:text-brand-green hover:bg-gray-100'
              }`}>
                <i className="fas fa-list mr-2"></i>
                Manage Blogs
              </a>
            </Link>
          </nav>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <Link href="/admin/add-blog">
              <Button className="bg-brand-green text-white hover:bg-opacity-90">
                <i className="fas fa-plus mr-2"></i>
                Add New Blog Post
              </Button>
            </Link>
            
            <Link href="/admin/manage-blogs">
              <Button variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white">
                <i className="fas fa-list mr-2"></i>
                Manage Blog Posts
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <i className="fas fa-file-alt text-brand-green"></i>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-black">
                {statsLoading ? "..." : stats?.totalPosts || 0}
              </div>
              <p className="text-xs text-text-grey">All blog posts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Posts</CardTitle>
              <i className="fas fa-edit text-amber-500"></i>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-black">
                {statsLoading ? "..." : stats?.draftPosts || 0}
              </div>
              <p className="text-xs text-text-grey">Unpublished drafts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
              <i className="fas fa-globe text-green-500"></i>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-black">
                {statsLoading ? "..." : stats?.publishedPosts || 0}
              </div>
              <p className="text-xs text-text-grey">Live on website</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Blog Posts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Blog Posts</CardTitle>
              <Link href="/admin/manage-blogs">
                <Button variant="outline" size="sm" className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {postsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-16 h-8 bg-gray-200 rounded"></div>
                        <div className="w-16 h-8 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : postsError ? (
              <div className="text-center py-8">
                <i className="fas fa-exclamation-triangle text-red-500 text-3xl mb-4"></i>
                <p className="text-text-grey">Failed to load blog posts</p>
              </div>
            ) : recentPosts?.posts.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-file-alt text-gray-300 text-6xl mb-4"></i>
                <h3 className="text-lg font-semibold text-brand-black mb-2">No Blog Posts Yet</h3>
                <p className="text-text-grey mb-4">
                  You haven't created any blog posts yet. Start sharing your expertise!
                </p>
                <Link href="/admin/add-blog">
                  <Button className="bg-brand-green text-white hover:bg-opacity-90">
                    Create Your First Post
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentPosts?.posts.slice(0, 5).map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-light-grey transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-brand-black mb-1">
                        {post.title}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-text-grey">
                        <span>
                          <i className={`fas ${post.status === 'published' ? 'fa-globe text-green-500' : 'fa-edit text-amber-500'} mr-1`}></i>
                          {post.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                        <span>{formatDate(post.createdAt!.toString())}</span>
                        {post.category && (
                          <span className="bg-brand-green text-white px-2 py-1 rounded text-xs">
                            {post.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/admin/manage-blogs?edit=${post.id}`}>
                        <Button variant="outline" size="sm" className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white">
                          Edit
                        </Button>
                      </Link>
                      {post.status === 'published' && (
                        <Link href={`/blog/${post.slug}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
