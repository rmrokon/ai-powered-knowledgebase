"use client"

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  User,
  Trash2,
  Eye,
  Clock,
  Loader2,
  FileText
} from "lucide-react";
import Link from "next/link";
import { useGetArticleBySlug, useDeleteArticle } from "@/components/hooks/api/use-articles";
import { useState } from "react";
import { ArticleSummaryModal } from "@/components/ui/article-summary-modal";

export default function ArticleDetails() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const { data: article, isLoading, error } = useGetArticleBySlug(slug);
  const deleteArticleMutation = useDeleteArticle({
    onSuccess: () => {
      router.push('/articles');
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  const handleDelete = () => {
    if (article) {
      deleteArticleMutation.mutate(article.id);
    }
  };

  const renderContent = (content: any) => {
    if (typeof content === 'string') {
      return content.split('\n').map((paragraph, index) => (
        <p key={index} className="mb-4 leading-relaxed">
          {paragraph}
        </p>
      ));
    }
    
    if (typeof content === 'object' && content !== null) {
      // Handle JSON content - you might want to implement a proper rich text renderer here
      return (
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <pre className="whitespace-pre-wrap bg-muted p-4 rounded-lg text-sm">
            {JSON.stringify(content, null, 2)}
          </pre>
        </div>
      );
    }
    
    return <p>No content available</p>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <Card className="p-12">
        <CardContent className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Article not found</h3>
          <p className="text-muted-foreground">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/articles">Back to Articles</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/articles">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSummaryModal(true)}
          >
            <FileText className="size-4 mr-2" />
            Summarize Article
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleteArticleMutation.isPending}
          >
            {deleteArticleMutation.isPending ? (
              <Loader2 className="size-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="size-4 mr-2" />
            )}
            Delete
          </Button>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-destructive">Delete Article</h3>
              <p className="text-muted-foreground">
                Are you sure you want to delete this article? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteArticleMutation.isPending}
                >
                  {deleteArticleMutation.isPending ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Yes, Delete'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Article Content */}
      <article className="space-y-6">
        {/* Title and Meta */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(article.status)}>
              {article.status}
            </Badge>
            {article.publishedAt && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="size-3" />
                <span>Published</span>
              </div>
            )}
          </div>
          
          <h1 className="text-4xl font-bold text-foreground leading-tight">
            {article.title}
          </h1>
          
          {article.excerpt && (
            <p className="text-xl text-muted-foreground leading-relaxed">
              {article.excerpt}
            </p>
          )}
        </div>

        {/* Author and Date Info */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="size-4" />
            <span>{article.user.firstName} {article.user.lastName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="size-4" />
            <span>Created {formatDate(article.createdAt)}</span>
          </div>
          {article.publishedAt && (
            <div className="flex items-center gap-2">
              <Clock className="size-4" />
              <span>Published {formatDate(article.publishedAt)}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tagWrapper) => (
              <Badge 
                key={tagWrapper.tag.id} 
                variant="outline"
                className="bg-secondary/50 hover:bg-secondary transition-colors"
                style={tagWrapper.tag.color ? { 
                  borderColor: tagWrapper.tag.color + '40',
                  color: tagWrapper.tag.color 
                } : {}}
              >
                {tagWrapper.tag.name}
              </Badge>
            ))}
          </div>
        )}

        <Separator />

        {/* Article Content */}
        <div className="prose prose-gray dark:prose-invert max-w-none">
          {renderContent(article.content)}
        </div>
      </article>

      {/* Footer */}
      <Separator />
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Last updated: {formatDate(article.updatedAt)}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/articles">← Back to Articles</Link>
          </Button>
        </div>
      </div>

      {/* Summary Modal */}
      {article && (
        <ArticleSummaryModal
          articleId={article.id}
          articleTitle={article.title}
          isOpen={showSummaryModal}
          onClose={() => setShowSummaryModal(false)}
        />
      )}
    </div>
  );
}
