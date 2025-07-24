"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { TagSelector } from "@/components/ui/tag-selector";
import { useCreateArticle } from "@/components/hooks/api/articles/use-create-article";
import { ArticleStatus } from "@/lib/api/repositories/article-repository";

export default function CreateArticle() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    slug: "",
    status: ArticleStatus.PUBLISHED,
    tagIds: [] as string[],
  });

  const createArticleMutation = useCreateArticle();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim()) {
      return;
    }

    // Prepare the data
    const articleData = {
      title: formData.title.trim(),
      content: formData.content.trim() || formData.title.trim(), // Use title as content if content is empty
      excerpt: formData.excerpt.trim(),
      slug: formData.slug.trim(),
      status: formData.status,
      tagIds: formData.tagIds,
    };

    createArticleMutation.mutate(articleData);
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    handleInputChange('slug', slug);
  };

  const generateExcerpt = () => {
    const excerpt = formData.content.substring(0, 200) + (formData.content.length > 200 ? '...' : '');
    handleInputChange('excerpt', excerpt);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/articles">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Article</h1>
          <p className="text-muted-foreground mt-1">
            Share your knowledge with the community
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter article title..."
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="text-lg font-semibold"
                    required
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your article content here..."
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    className="min-h-[300px] resize-y"
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.content.length} characters
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "DRAFT" | "PUBLISHED" | "ARCHIVED") => 
                      handleInputChange('status', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button 
                    type="submit" 
                    disabled={!formData.title.trim() || createArticleMutation.isPending}
                    className="w-full"
                  >
                    {createArticleMutation.isPending ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="size-4 mr-2" />
                        Create Article
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Add Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tags */}
                <div className="space-y-2">
                  <TagSelector
                    selectedTagIds={formData.tagIds}
                    onTagsChange={(tagIds) => handleInputChange('tagIds', tagIds)}
                    placeholder="Search or create tags..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
