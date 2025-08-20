import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { BlogPostWithAuthor } from "@shared/schema";

interface BlogResponse {
  posts: BlogPostWithAuthor[];
  total: number;
  page: number;
  pages: number;
}

export default function Blog() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const { data, isLoading, error } = useQuery<BlogResponse>({
    queryKey: ["/api/blog", page, search, category],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "9",
        ...(search && { search }),
        ...(category && { category }),
      });
      
      const response = await fetch(`/api/blog?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      return response.json();
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value === "all" ? "" : value);
    setPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Property Tips", label: "Property Tips" },
    { value: "Market Insights", label: "Market Insights" },
    { value: "Expert Guide", label: "Expert Guide" },
    { value: "Industry News", label: "Industry News" },
    { value: "UAE Real Estate", label: "UAE Real Estate" },
  ];

  if (error) {
    return (
      <div className="pt-16 lg:pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-black mb-4">Error Loading Blog</h2>
          <p className="text-text-grey">Failed to load blog posts. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
              Property Snagging Blog UAE & Expert Tips
            </h1>
            <p className="text-xl text-text-grey leading-relaxed">
              Stay informed with the latest <Link href="/services/property-snagging/new-build-snagging" className="text-brand-green hover:underline font-medium">property snagging insights Dubai</Link>, UAE market trends, and expert advice from our professional <Link href="/locations/abu-dhabi/snagging-company" className="text-brand-green hover:underline font-medium">snagging company</Link> team.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="md:w-48">
                <Select value={category || "all"} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button type="submit" className="bg-brand-green text-white hover:bg-opacity-90">
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-12 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-brand-black mb-6">
              Professional Property Inspection Services
            </h2>
            <p className="text-text-grey mb-8">
              Discover our comprehensive <Link href="/services" className="text-brand-green hover:underline font-medium">property inspection services UAE</Link> and professional <Link href="/services/property-snagging/new-build-snagging" className="text-brand-green hover:underline font-medium">snagging services Dubai</Link> across all Emirates
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/services/property-snagging/new-build-snagging">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <i className="fas fa-home text-brand-green text-3xl mb-4"></i>
                    <h3 className="font-semibold text-brand-black mb-2">New Build Snagging Dubai</h3>
                    <p className="text-sm text-text-grey">Professional Property Snagging - AED 1/Sq.ft</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/services/property-snagging/post-renovation-inspection">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <i className="fas fa-tools text-brand-green text-3xl mb-4"></i>
                    <h3 className="font-semibold text-brand-black mb-2">Property Inspection UAE</h3>
                    <p className="text-sm text-text-grey">Post-Renovation Snagging - AED 1/Sq.ft</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/locations/dubai/snagging-company">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <i className="fas fa-map-marker-alt text-brand-green text-3xl mb-4"></i>
                    <h3 className="font-semibold text-brand-black mb-2">Snagging Company Dubai</h3>
                    <p className="text-sm text-text-grey">Leading Property Snagging Experts</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 9 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-16 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : data?.posts.length === 0 ? (
            <div className="text-center py-16">
              <i className="fas fa-search text-gray-300 text-6xl mb-4"></i>
              <h3 className="text-2xl font-bold text-brand-black mb-4">No Articles Found</h3>
              <p className="text-text-grey mb-8">
                {search || category 
                  ? "No articles match your search criteria. Try adjusting your filters."
                  : "No blog posts have been published yet. Check back soon for new content."
                }
              </p>
              {(search || category) && (
                <Button 
                  onClick={() => {
                    setSearch("");
                    setCategory("");
                    setPage(1);
                  }}
                  variant="outline"
                  className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data?.posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {post.featuredImage && (
                      <div 
                        className="h-48 bg-cover bg-center"
                        style={{ backgroundImage: `url(${post.featuredImage})` }}
                      ></div>
                    )}
                    <CardContent className="p-6">
                      {post.category && (
                        <Badge className="mb-2 bg-brand-green text-white">
                          {post.category}
                        </Badge>
                      )}
                      
                      <h2 className="text-xl font-semibold text-brand-black mb-3 hover:text-brand-green transition-colors">
                        <Link href={`/blog/${post.slug}`}>
                          <a>{post.title}</a>
                        </Link>
                      </h2>
                      
                      {post.excerpt && (
                        <p className="text-text-grey mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{formatDate(post.createdAt!.toString())}</span>
                        <Link href={`/blog/${post.slug}`}>
                          <a className="text-brand-green font-medium hover:underline">
                            Read More →
                          </a>
                        </Link>
                      </div>
                      
                      {post.author && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center">
                            {post.author.profileImageUrl && (
                              <img
                                src={post.author.profileImageUrl}
                                alt={`${post.author.firstName} ${post.author.lastName}`}
                                className="w-8 h-8 rounded-full mr-3 object-cover"
                              />
                            )}
                            <span className="text-sm text-text-grey">
                              By {post.author.firstName} {post.author.lastName}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {data && data.pages > 1 && (
                <div className="flex justify-center mt-12">
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
        </div>
      </section>
    </div>
  );
}
