import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NotFound from "@/pages/not-found";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { BlogPostWithAuthor } from "@shared/schema";

export default function BlogDetail() {
  const params = useParams();
  const slug = params.slug;

  const { data: post, isLoading, error } = useQuery<BlogPostWithAuthor>({
    queryKey: ["/api/blog", slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Post not found');
        }
        throw new Error('Failed to fetch blog post');
      }
      return response.json();
    },
    enabled: !!slug,
  });

  const { data: relatedPosts } = useQuery<{ posts: BlogPostWithAuthor[] }>({
    queryKey: ["/api/blog", "related", post?.category],
    queryFn: async () => {
      const response = await fetch(`/api/blog?category=${post?.category}&limit=3`);
      if (!response.ok) {
        throw new Error('Failed to fetch related posts');
      }
      return response.json();
    },
    enabled: !!post?.category,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = post?.title || '';

  const shareButtons = [
    {
      name: 'Facebook',
      icon: 'fab fa-facebook-f',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Twitter',
      icon: 'fab fa-twitter',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      color: 'bg-blue-400 hover:bg-blue-500'
    },
    {
      name: 'LinkedIn',
      icon: 'fab fa-linkedin-in',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-700 hover:bg-blue-800'
    },
    {
      name: 'WhatsApp',
      icon: 'fab fa-whatsapp',
      url: `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`,
      color: 'bg-green-500 hover:bg-green-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="pt-32 bg-white min-h-screen">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-16">
          <div className="max-w-3xl">
            <div className="animate-pulse">
              <div className="h-4 w-32 bg-zinc-100 mb-8"></div>
              <div className="h-12 w-full bg-zinc-100 mb-6"></div>
              <div className="h-12 w-3/4 bg-zinc-100 mb-12"></div>
              <div className="aspect-video bg-zinc-100 mb-12"></div>
              <div className="space-y-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-4 bg-zinc-100 rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return <NotFound />;
  }

  return (
    <div className="bg-white">
      {/* Article Header & Hero */}
      <section className="pt-32 pb-24 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-4xl">
            {/* Breadcrumb / Category */}
            <div className="flex items-center gap-4 mb-8">
              <Link href="/blog">
                <span className="text-[10px] font-bold tracking-[0.2em] text-brand-green uppercase cursor-pointer hover:text-white transition-colors">
                  ← Back to Blog
                </span>
              </Link>
              <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
              {post.category && (
                <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">
                  {post.category}
                </span>
              )}
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-8 leading-[1.1]">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-y-4 gap-x-8 pt-8 border-t border-zinc-900">
              {post.author && (
                <div className="flex items-center gap-3">
                  {post.author.profileImageUrl && (
                    <img
                      src={post.author.profileImageUrl}
                      alt={`${post.author.firstName}`}
                      className="w-10 h-10 rounded-full object-cover grayscale"
                    />
                  )}
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-0.5">Author</p>
                    <p className="text-sm font-bold text-white">{post.author.firstName} {post.author.lastName}</p>
                  </div>
                </div>
              )}
              
              <div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-0.5">Published</p>
                <p className="text-sm font-bold text-white">{formatDate(post.createdAt!.toString())}</p>
              </div>

              <div className="ml-auto flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Share</span>
                <div className="flex gap-2">
                  {shareButtons.map((button) => (
                    <a
                      key={button.name}
                      href={button.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 flex items-center justify-center bg-zinc-900 text-zinc-400 hover:bg-brand-green hover:text-white transition-all rounded-none"
                      aria-label={`Share on ${button.name}`}
                    >
                      <i className={button.icon + " text-xs"}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.featuredImage && (
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="-mt-12 relative z-10">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-[400px] md:h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-3xl mx-auto">
            <article className="prose prose-zinc prose-lg max-w-none prose-headings:text-zinc-900 prose-headings:font-bold prose-p:text-zinc-500 prose-p:leading-relaxed prose-strong:text-zinc-900 prose-strong:font-bold prose-ul:text-zinc-500 prose-ol:text-zinc-500 prose-li:mb-2 prose-a:text-brand-green prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-zinc-900 transition-colors">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({children}) => <h1 className="text-4xl font-bold text-zinc-900 mb-8 mt-12">{children}</h1>,
                  h2: ({children}) => <h2 className="text-3xl font-bold text-zinc-900 mb-6 mt-10">{children}</h2>,
                  h3: ({children}) => <h3 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">{children}</h3>,
                  h4: ({children}) => <h4 className="text-xl font-bold text-zinc-900 mb-4 mt-6">{children}</h4>,
                  p: ({children}) => <p className="text-zinc-500 leading-relaxed mb-8">{children}</p>,
                  ul: ({children}) => <ul className="list-none pl-0 mb-8 space-y-4">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal pl-6 mb-8 space-y-4 text-zinc-500">{children}</ol>,
                  li: ({children}) => (
                    <li className="flex gap-4">
                      <span className="text-brand-green font-bold text-lg leading-tight">→</span>
                      <span>{children}</span>
                    </li>
                  ),
                  strong: ({children}) => <strong className="font-bold text-zinc-900">{children}</strong>,
                  blockquote: ({children}) => (
                    <blockquote className="border-l-4 border-brand-green pl-8 py-2 my-12 text-2xl italic font-medium text-zinc-900 bg-zinc-50">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </article>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-zinc-100">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Tags</span>
                  {post.tags.map((tag, index) => (
                    <span key={index} className="text-[10px] uppercase tracking-widest bg-zinc-50 text-zinc-500 px-3 py-1 font-bold border border-zinc-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Author Info */}
      {post.author && (
        <section className="py-24 bg-zinc-50 border-y border-zinc-100">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-12 items-center text-center md:text-left">
              {post.author.profileImageUrl && (
                <img
                  src={post.author.profileImageUrl}
                  alt={`${post.author.firstName}`}
                  className="w-32 h-32 rounded-full object-cover grayscale"
                />
              )}
              <div className="flex-1">
                <p className="text-[10px] font-bold tracking-[0.25em] text-brand-green uppercase mb-2">About the Author</p>
                <h3 className="text-2xl font-bold text-zinc-900 mb-4">
                  {post.author.firstName} {post.author.lastName}
                </h3>
                <p className="text-zinc-500 leading-relaxed">
                  Professional property inspection expert with extensive experience in the UAE real estate market. 
                  Specializing in technical snagging and handover inspections across Dubai and Abu Dhabi.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Call-to-Action Section */}
      <section className="py-24 bg-brand-green text-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row gap-12 items-center lg:justify-between">
            <div className="max-w-2xl text-center lg:text-left">
              <p className="text-[10px] font-bold tracking-[0.25em] text-white/60 uppercase mb-4">Next Steps</p>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight">
                Ready to ensure your property is flawless?
              </h2>
              <p className="text-lg text-white/80 leading-relaxed mb-0">
                Book a professional snagging inspection with UrbanGrid today and get a comprehensive report same-day.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/locations/dubai/property-inspection">
                <Button className="bg-white text-brand-green hover:bg-zinc-950 hover:text-white rounded-none h-14 px-10 transition-all uppercase text-[10px] font-bold tracking-widest">
                  Book in Dubai
                </Button>
              </Link>
              <Link href="/locations/abu-dhabi/property-inspection">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-brand-green rounded-none h-14 px-10 transition-all uppercase text-[10px] font-bold tracking-widest">
                  Book in Abu Dhabi
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts && relatedPosts.posts.length > 0 && (
        <section className="py-24 lg:py-32 bg-white">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-xl">
                <p className="text-[10px] font-bold tracking-[0.25em] text-brand-green uppercase mb-4">Further Reading</p>
                <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight">
                  Related Insights
                </h2>
              </div>
              <Link href="/blog">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all uppercase tracking-widest cursor-pointer">
                  View All Articles
                </span>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {relatedPosts.posts
                .filter(relatedPost => relatedPost.id !== post.id)
                .slice(0, 3)
                .map((relatedPost) => (
                  <article key={relatedPost.id} className="group">
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <div className="cursor-pointer">
                        {relatedPost.featuredImage && (
                          <div className="aspect-[16/10] overflow-hidden mb-6 bg-zinc-100">
                            <img 
                              src={relatedPost.featuredImage} 
                              alt={relatedPost.title}
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-[10px] uppercase tracking-[0.18em] text-brand-green font-bold">
                            {relatedPost.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 mb-4 leading-tight group-hover:text-brand-green transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed mb-6">
                          {relatedPost.excerpt}
                        </p>
                        <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-400 font-bold">
                          {formatDate(relatedPost.createdAt!.toString())}
                        </span>
                      </div>
                    </Link>
                  </article>
                ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
