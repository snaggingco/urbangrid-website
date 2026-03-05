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
      <div className="pt-24 min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">Error Loading Blog</h2>
          <p className="text-zinc-500">Failed to load blog posts. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="pt-40 pb-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-4xl">
            <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">
              Insights & Expertise
            </p>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-[8rem] font-bold text-white leading-[0.95] tracking-tight mb-8">
              Property <br />Snagging Blog
            </h1>
            <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-2xl font-light">
              Stay informed with the latest <Link href="/locations/dubai/property-inspection" className="text-brand-green hover:text-white transition-colors underline underline-offset-4">property inspection dubai</Link> insights, UAE market trends, and expert advice from our professional <Link href="/locations/abu-dhabi/snagging-company" className="text-brand-green hover:text-white transition-colors underline underline-offset-4">snagging company abu dhabi</Link> team.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 border-b border-zinc-100 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
              <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 block font-bold">Search Articles</label>
              <Input
                type="text"
                placeholder="Keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-none border-zinc-200 focus:border-brand-green focus:ring-0 h-12 bg-white"
              />
            </div>
            
            <div className="md:w-64 w-full">
              <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 block font-bold">Category</label>
              <Select value={category || "all"} onValueChange={handleCategoryChange}>
                <SelectTrigger className="rounded-none border-zinc-200 focus:border-brand-green focus:ring-0 h-12 bg-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-zinc-200">
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="rounded-none focus:bg-zinc-50">
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" className="bg-brand-green text-white hover:bg-zinc-900 rounded-none h-12 px-10 transition-colors uppercase text-[10px] font-bold tracking-[0.2em]">
              Apply Filters
            </Button>
          </form>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-24 lg:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[16/10] bg-zinc-100 mb-6"></div>
                  <div className="h-3 w-20 bg-zinc-100 mb-4"></div>
                  <div className="h-6 bg-zinc-100 mb-4"></div>
                  <div className="h-20 bg-zinc-100 mb-6"></div>
                  <div className="h-3 w-32 bg-zinc-100"></div>
                </div>
              ))}
            </div>
          ) : data?.posts.length === 0 ? (
            <div className="text-center py-24">
              <h3 className="text-2xl font-bold text-zinc-900 mb-4">No Articles Found</h3>
              <p className="text-zinc-500 mb-8 max-w-md mx-auto">
                {search || category 
                  ? "No articles match your search criteria. Try adjusting your filters."
                  : "No blog posts have been published yet. Check back soon for new content."
                }
              </p>
              {(search || category) && (
                <button 
                  onClick={() => {
                    setSearch("");
                    setCategory("");
                    setPage(1);
                  }}
                  className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-brand-green uppercase border-b border-brand-green pb-1 hover:text-zinc-900 hover:border-zinc-900 transition-all"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                {data?.posts.map((post) => (
                  <article key={post.id} className="group border border-zinc-100 p-6 flex flex-col">
                    <Link href={`/blog/${post.slug}`}>
                      <div className="cursor-pointer flex flex-col h-full">
                        {post.featuredImage && (
                          <div className="aspect-[16/10] overflow-hidden mb-6 bg-zinc-100">
                            <img 
                              src={post.featuredImage} 
                              alt={post.title}
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center gap-3 mb-4">
                          {post.category && (
                            <span className="text-[10px] uppercase tracking-[0.2em] text-brand-green font-bold">
                              {post.category}
                            </span>
                          )}
                          <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
                          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                            {formatDate(post.createdAt!.toString())}
                          </span>
                        </div>
                        
                        <h2 className="text-xl font-bold text-zinc-900 mb-4 leading-tight group-hover:text-brand-green transition-colors">
                          {post.title}
                        </h2>
                        
                        {post.excerpt && (
                          <p className="text-sm text-zinc-500 mb-8 line-clamp-3 leading-relaxed font-light">
                            {post.excerpt}
                          </p>
                        )}
                        
                        <div className="mt-auto flex items-center justify-between items-end">
                          <span className="inline-flex items-center gap-2 text-[10px] font-bold text-brand-green border-b border-brand-green pb-0.5 group-hover:gap-3 transition-all uppercase tracking-[0.2em]">
                            Read Article
                          </span>
                          
                          {post.author && (
                            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium">
                              By {post.author.firstName}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {data && data.pages > 1 && (
                <div className="flex justify-center mt-24 pt-12 border-t border-zinc-100">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      variant="outline"
                      className="rounded-none border-zinc-200 text-zinc-500 hover:text-brand-green hover:border-brand-green disabled:opacity-30 uppercase text-[10px] font-bold tracking-widest h-10 px-6"
                    >
                      Prev
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: data.pages }, (_, i) => i + 1).map((pageNum) => (
                        <Button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          variant={page === pageNum ? "default" : "outline"}
                          className={`
                            rounded-none h-10 w-10 p-0 text-[10px] font-bold
                            ${page === pageNum
                              ? "bg-zinc-950 text-white border-zinc-950"
                              : "border-zinc-200 text-zinc-500 hover:text-brand-green hover:border-brand-green"}
                          `}
                        >
                          {pageNum < 10 ? `0${pageNum}` : pageNum}
                        </Button>
                      ))}
                    </div>
                    
                    <Button
                      onClick={() => setPage(page + 1)}
                      disabled={page === data.pages}
                      variant="outline"
                      className="rounded-none border-zinc-200 text-zinc-500 hover:text-brand-green hover:border-brand-green disabled:opacity-30 uppercase text-[10px] font-bold tracking-widest h-10 px-6"
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
