import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NotFound from "@/pages/not-found";
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
      <div className="pt-16 lg:pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-64 bg-gray-200 rounded mb-8"></div>
              <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
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
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-text-grey mb-8">
              <Link href="/">
                <a className="hover:text-brand-green">Home</a>
              </Link>
              <span>/</span>
              <Link href="/blog">
                <a className="hover:text-brand-green">Blog</a>
              </Link>
              <span>/</span>
              <span className="text-brand-green">{post.title}</span>
            </nav>

            {/* Article Header */}
            <header className="mb-8">
              {post.category && (
                <Badge className="mb-4 bg-brand-green text-white">
                  {post.category}
                </Badge>
              )}
              
              <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6 leading-tight">
                {post.title}
              </h1>
              
              {post.excerpt && (
                <p className="text-xl text-text-grey leading-relaxed mb-6">
                  {post.excerpt}
                </p>
              )}

              <div className="flex items-center justify-between border-t border-b border-gray-200 py-4">
                <div className="flex items-center">
                  {post.author?.profileImageUrl && (
                    <img
                      src={post.author.profileImageUrl}
                      alt={`${post.author.firstName} ${post.author.lastName}`}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                  )}
                  <div>
                    <div className="font-semibold text-brand-black">
                      {post.author?.firstName} {post.author?.lastName}
                    </div>
                    <div className="text-sm text-text-grey">
                      Published on {formatDate(post.createdAt!)}
                    </div>
                  </div>
                </div>
                
                {/* Share Buttons */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-text-grey mr-2">Share:</span>
                  {shareButtons.map((button) => (
                    <a
                      key={button.name}
                      href={button.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${button.color} text-white p-2 rounded-full text-sm transition-colors`}
                      aria-label={`Share on ${button.name}`}
                    >
                      <i className={button.icon}></i>
                    </a>
                  ))}
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="mb-8">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <article className="prose prose-lg max-w-none">
              <div 
                className="text-text-grey leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-text-grey">Tags:</span>
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="border-brand-green text-brand-green">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Author Info */}
      {post.author && (
        <section className="py-8 bg-light-grey">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    {post.author.profileImageUrl && (
                      <img
                        src={post.author.profileImageUrl}
                        alt={`${post.author.firstName} ${post.author.lastName}`}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-brand-black mb-2">
                        About {post.author.firstName} {post.author.lastName}
                      </h3>
                      <p className="text-text-grey">
                        Professional property inspection expert with extensive experience in the UAE real estate market.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Related Posts */}
      {relatedPosts && relatedPosts.posts.length > 0 && (
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-brand-black mb-12 text-center">
                Related Articles
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.posts
                  .filter(relatedPost => relatedPost.id !== post.id)
                  .slice(0, 3)
                  .map((relatedPost) => (
                    <Card key={relatedPost.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {relatedPost.featuredImage && (
                        <div 
                          className="h-48 bg-cover bg-center"
                          style={{ backgroundImage: `url(${relatedPost.featuredImage})` }}
                        ></div>
                      )}
                      <CardContent className="p-6">
                        {relatedPost.category && (
                          <Badge className="mb-2 bg-brand-green text-white">
                            {relatedPost.category}
                          </Badge>
                        )}
                        
                        <h3 className="text-lg font-semibold text-brand-black mb-3 hover:text-brand-green transition-colors">
                          <Link href={`/blog/${relatedPost.slug}`}>
                            <a>{relatedPost.title}</a>
                          </Link>
                        </h3>
                        
                        {relatedPost.excerpt && (
                          <p className="text-text-grey mb-4 line-clamp-3 text-sm">
                            {relatedPost.excerpt}
                          </p>
                        )}
                        
                        <div className="text-sm text-gray-500">
                          {formatDate(relatedPost.createdAt!)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
              
              <div className="text-center mt-12">
                <Link href="/blog">
                  <Button className="bg-brand-green text-white hover:bg-opacity-90">
                    View All Articles
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
