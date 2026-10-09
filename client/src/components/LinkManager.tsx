import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

interface BlogLinkData {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
}

interface LinkManagerProps {
  onInsertLink: (link: string) => void;
  trigger?: React.ReactNode;
}

export default function LinkManager({ onInsertLink, trigger }: LinkManagerProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("internal");
  
  // Internal link state
  const [selectedPost, setSelectedPost] = useState<BlogLinkData | null>(null);
  const [linkText, setLinkText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // External link state
  const [externalUrl, setExternalUrl] = useState("");
  const [externalText, setExternalText] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const [noFollow, setNoFollow] = useState(false);

  // Fetch available blog posts for internal linking
  const { data: blogPosts, isLoading } = useQuery<BlogLinkData[]>({
    queryKey: ["/api/admin/blog/links"],
    queryFn: async () => {
      const response = await fetch("/api/admin/blog/links", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch blog posts");
      return response.json();
    },
    enabled: open && activeTab === "internal",
  });

  // Filter blog posts based on search
  const filteredPosts = blogPosts?.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleInsertInternalLink = () => {
    if (!selectedPost || !linkText.trim()) return;
    
    const link = `<a href="/blog/${selectedPost.slug}" class="text-brand-green hover:underline">${linkText}</a>`;
    onInsertLink(link);
    resetAndClose();
  };

  const handleInsertExternalLink = () => {
    if (!externalUrl.trim() || !externalText.trim()) return;
    
    // Validate URL
    try {
      const url = new URL(externalUrl.startsWith('http') ? externalUrl : `https://${externalUrl}`);
      const attributes = [];
      
      if (openInNewTab) {
        attributes.push('target="_blank"');
        attributes.push('rel="noopener noreferrer"');
      }
      
      if (noFollow) {
        attributes.push('rel="nofollow"');
      }
      
      const link = `<a href="${url.href}" ${attributes.join(' ')} class="text-brand-green hover:underline">${externalText}</a>`;
      onInsertLink(link);
      resetAndClose();
    } catch (error) {
      alert("Please enter a valid URL");
    }
  };

  const resetAndClose = () => {
    setOpen(false);
    setSelectedPost(null);
    setLinkText("");
    setSearchTerm("");
    setExternalUrl("");
    setExternalText("");
    setOpenInNewTab(true);
    setNoFollow(false);
  };

  // Auto-fill link text when post is selected
  useEffect(() => {
    if (selectedPost && !linkText) {
      setLinkText(selectedPost.title);
    }
  }, [selectedPost, linkText]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <i className="fas fa-link mr-2"></i>
            Insert Link
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Insert Link</DialogTitle>
          <DialogDescription>
            Add internal links to other blog posts or external links to resources.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="internal">Internal Link</TabsTrigger>
            <TabsTrigger value="external">External Link</TabsTrigger>
          </TabsList>

          <TabsContent value="internal" className="space-y-4">
            <div>
              <Label htmlFor="search">Search Blog Posts</Label>
              <Input
                id="search"
                placeholder="Search by title or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <ScrollArea className="h-64 border rounded-md p-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading posts...</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {searchTerm ? "No posts found matching your search." : "No published posts available for linking."}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredPosts.map((post) => (
                    <Card 
                      key={post.id} 
                      className={`cursor-pointer transition-colors ${
                        selectedPost?.id === post.id ? 'ring-2 ring-brand-green bg-green-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedPost(post)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{post.title}</h4>
                            {post.category && (
                              <Badge variant="secondary" className="mt-1 text-xs">
                                {post.category}
                              </Badge>
                            )}
                            {post.excerpt && (
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {post.excerpt}
                              </p>
                            )}
                          </div>
                          {selectedPost?.id === post.id && (
                            <i className="fas fa-check-circle text-brand-green ml-2"></i>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>

            <div>
              <Label htmlFor="linkText">Link Text</Label>
              <Input
                id="linkText"
                placeholder="Text to display for the link"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={resetAndClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleInsertInternalLink}
                disabled={!selectedPost || !linkText.trim()}
                className="bg-brand-green hover:bg-brand-green/90"
              >
                Insert Internal Link
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="external" className="space-y-4">
            <div>
              <Label htmlFor="externalUrl">URL</Label>
              <Input
                id="externalUrl"
                placeholder="https://example.com"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="externalText">Link Text</Label>
              <Input
                id="externalText"
                placeholder="Text to display for the link"
                value={externalText}
                onChange={(e) => setExternalText(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="newTab"
                  checked={openInNewTab}
                  onChange={(e) => setOpenInNewTab(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="newTab" className="text-sm">
                  Open in new tab (recommended for external links)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="noFollow"
                  checked={noFollow}
                  onChange={(e) => setNoFollow(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="noFollow" className="text-sm">
                  Add nofollow attribute (for SEO purposes)
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={resetAndClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleInsertExternalLink}
                disabled={!externalUrl.trim() || !externalText.trim()}
                className="bg-brand-green hover:bg-brand-green/90"
              >
                Insert External Link
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}