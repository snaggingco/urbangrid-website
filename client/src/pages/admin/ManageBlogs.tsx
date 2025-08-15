import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { BlogPostWithAuthor } from "@shared/schema";

interface BlogResponse {
  posts: BlogPostWithAuthor[];
  total: number;
  page: number;
  pages: number;
}

export default function ManageBlogs() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      toast({
        title: "Unauthorized",
        description: "You need admin access to manage blog posts. Redirecting to login...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data, isLoading: postsLoading, error } = useQuery<BlogResponse>({
    queryKey: ["/api/admin/blog", page, search, status],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(status && { status }),
      });
      
      const response = await fetch(`/api/admin/blog?${params}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      return response.json();
    },
    retry: false,
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const deleteBlogMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/blog/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Blog Deleted",
        description: "The blog post has been deleted successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Redirecting to login...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete blog post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value === "all" ? "" : value);
    setPage(1);
  };

  const handleDelete = (id: number) => {
    deleteBlogMutation.mutate(id);
  };

  if (isLoading || (!isAuthenticated || user?.role !== 'admin')) {
    return (
      <div className="pt-16 lg:pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  // Handle unauthorized errors
  useEffect(() => {
    if (error && isUnauthorizedError(error as Error)) {
      toast({
        title: "Session Expired",
        description: "Your session has expired. Redirecting to login...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [error, toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
  ];

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-light-grey">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-brand-black mb-2">
                Manage Blog Posts
              </h1>
              <p className="text-text-grey">
                View, edit, and manage all your blog content.
              </p>
            </div>
            <Link href="/admin/add-blog">
              <Button className="bg-brand-green text-white hover:bg-opacity-90">
                <i className="fas fa-plus mr-2"></i>
                Add New Post
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search blog posts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <div className="md:w-48">
                <Select value={status || "all"} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button type="submit" className="bg-brand-green text-white hover:bg-opacity-90">
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Blog Posts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Blog Posts ({data?.total || 0})</CardTitle>
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
                        <div className="w-16 h-8 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <i className="fas fa-exclamation-triangle text-red-500 text-3xl mb-4"></i>
                <p className="text-text-grey">Failed to load blog posts</p>
              </div>
            ) : data?.posts.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-file-alt text-gray-300 text-6xl mb-4"></i>
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  {search || status ? "No Posts Found" : "No Blog Posts Yet"}
                </h3>
                <p className="text-text-grey mb-4">
                  {search || status 
                    ? "No posts match your search criteria. Try adjusting your filters."
                    : "You haven't created any blog posts yet. Start sharing your expertise!"
                  }
                </p>
                {(search || status) ? (
                  <Button 
                    onClick={() => {
                      setSearch("");
                      setStatus("");
                      setPage(1);
                    }}
                    variant="outline"
                    className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
                  >
                    Clear Filters
                  </Button>
                ) : (
                  <Link href="/admin/add-blog">
                    <Button className="bg-brand-green text-white hover:bg-opacity-90">
                      Create Your First Post
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {data.posts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-light-grey transition-colors">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-brand-black mb-1">
                              {post.title}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-text-grey mb-2">
                              <Badge 
                                className={post.status === 'published' 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-amber-100 text-amber-800"
                                }
                              >
                                <i className={`fas ${post.status === 'published' ? 'fa-globe' : 'fa-edit'} mr-1`}></i>
                                {post.status === 'published' ? 'Published' : 'Draft'}
                              </Badge>
                              <span>{formatDate(post.createdAt!)}</span>
                              {post.category && (
                                <span className="bg-brand-green text-white px-2 py-1 rounded text-xs">
                                  {post.category}
                                </span>
                              )}
                            </div>
                            {post.excerpt && (
                              <p className="text-sm text-text-grey line-clamp-2">
                                {post.excerpt}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {post.status === 'published' && (
                          <Link href={`/blog/${post.slug}`}>
                            <Button variant="outline" size="sm">
                              <i className="fas fa-eye mr-1"></i>
                              View
                            </Button>
                          </Link>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
                        >
                          <i className="fas fa-edit mr-1"></i>
                          Edit
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                              <i className="fas fa-trash mr-1"></i>
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{post.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(post.id)}
                                className="bg-red-500 hover:bg-red-600"
                                disabled={deleteBlogMutation.isPending}
                              >
                                {deleteBlogMutation.isPending ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {data && data.pages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        variant="outline"
                        className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
                      >
                        Previous
                      </Button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: data.pages }, (_, i) => i + 1).map((pageNum) => (
                          <Button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            variant={page === pageNum ? "default" : "outline"}
                            className={
                              page === pageNum
                                ? "bg-brand-green text-white"
                                : "border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
                            }
                            size="sm"
                          >
                            {pageNum}
                          </Button>
                        ))}
                      </div>
                      
                      <Button
                        onClick={() => setPage(page + 1)}
                        disabled={page === data.pages}
                        variant="outline"
                        className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
