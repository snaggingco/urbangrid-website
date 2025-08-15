import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EnhancedEditor from "@/components/EnhancedEditor";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

const blogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  category: z.string().min(1, "Please select a category"),
  tags: z.string().optional(),
  featuredImage: z.string().url("Please enter a valid image URL").optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
});

type BlogFormData = z.infer<typeof blogSchema>;

export default function AddBlog() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      toast({
        title: "Unauthorized",
        description: "You need admin access to create blog posts. Redirecting to login...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      status: "draft",
    },
  });

  const createBlogMutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      const blogData = {
        ...data,
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()) : [],
      };
      return apiRequest("POST", "/api/admin/blog", blogData);
    },
    onSuccess: () => {
      toast({
        title: "Blog Post Created!",
        description: "Your blog post has been created successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setLocation("/admin/manage-blogs");
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
        description: "Failed to create blog post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BlogFormData) => {
    createBlogMutation.mutate(data);
  };

  if (isLoading || (!isAuthenticated || user?.role !== 'admin')) {
    return (
      <div className="pt-16 lg:pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  const categories = [
    "Property Tips",
    "Market Insights", 
    "Expert Guide",
    "Industry News",
    "UAE Real Estate",
    "Inspection Guide",
  ];

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-light-grey">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Navigation */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-black mb-2">
            Add New Blog Post
          </h1>
          <p className="text-text-grey mb-6">
            Create and publish new content for your website.
          </p>
          
          {/* Admin Navigation */}
          <nav className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <Link href="/admin">
              <a className="px-4 py-2 rounded-md text-sm font-medium transition-colors text-text-grey hover:text-brand-green hover:bg-gray-100">
                <i className="fas fa-home mr-2"></i>
                Dashboard
              </a>
            </Link>
            <Link href="/admin/add-blog">
              <a className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-brand-green text-white">
                <i className="fas fa-plus mr-2"></i>
                Add Blog
              </a>
            </Link>
            <Link href="/admin/manage-blogs">
              <a className="px-4 py-2 rounded-md text-sm font-medium transition-colors text-text-grey hover:text-brand-green hover:bg-gray-100">
                <i className="fas fa-list mr-2"></i>
                Manage Blogs
              </a>
            </Link>
          </nav>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Post Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      {...register("title")}
                      placeholder="Enter post title"
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt *</Label>
                    <Textarea
                      id="excerpt"
                      {...register("excerpt")}
                      placeholder="Brief description of the post"
                      rows={3}
                      className={errors.excerpt ? "border-red-500" : ""}
                    />
                    {errors.excerpt && (
                      <p className="text-red-500 text-sm mt-1">{errors.excerpt.message}</p>
                    )}
                  </div>

                  <EnhancedEditor
                    label="Content"
                    value={watch("content") || ""}
                    onChange={(value) => setValue("content", value)}
                    placeholder="Write your blog post content here..."
                    rows={15}
                    error={errors.content?.message}
                    id="content"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publish</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={watch("status")} 
                      onValueChange={(value: "draft" | "published") => setValue("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Button
                      type="submit"
                      disabled={createBlogMutation.isPending}
                      className="w-full bg-brand-green text-white hover:bg-opacity-90"
                    >
                      {createBlogMutation.isPending ? "Saving..." : watch("status") === "published" ? "Publish" : "Save Draft"}
                    </Button>
                    
                    <Link href="/admin/manage-blogs">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
                      >
                        <i className="fas fa-arrow-left mr-2"></i>
                        Back to Manage Blogs
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Post Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={(value) => setValue("category", value)}>
                      <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      {...register("tags")}
                      placeholder="Enter tags separated by commas"
                    />
                    <p className="text-sm text-text-grey mt-1">
                      Separate multiple tags with commas
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="featuredImage">Featured Image URL</Label>
                    <Input
                      id="featuredImage"
                      {...register("featuredImage")}
                      placeholder="https://example.com/image.jpg"
                      className={errors.featuredImage ? "border-red-500" : ""}
                    />
                    {errors.featuredImage && (
                      <p className="text-red-500 text-sm mt-1">{errors.featuredImage.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
