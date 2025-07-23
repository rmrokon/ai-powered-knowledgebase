"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, Loader2, FileText } from "lucide-react";
import Link from "next/link";
import ArticleCard from "./articles-card";
import { useGetArticles, useSearchArticles } from "@/components/hooks/api/use-articles";
import { useDebouncedSearch } from "@/components/hooks/use-debounced-search";

export default function Articles() {
  const [currentPage, setCurrentPage] = useState(1);
  const { searchTerm, debouncedSearchTerm, setSearchTerm } = useDebouncedSearch("", 500);

  // Use search query if there's a debounced search term, otherwise get all articles
  const {
    data: articlesData,
    isLoading: isLoadingArticles,
    error: articlesError
  } = useGetArticles(currentPage, 12, undefined, {
    enabled: !debouncedSearchTerm
  });

  const {
    data: searchData,
    isLoading: isSearching,
    error: searchError
  } = useSearchArticles(debouncedSearchTerm, currentPage, 12, {
    enabled: !!debouncedSearchTerm
  });

  // Determine which data to use
  const data = debouncedSearchTerm ? searchData : articlesData;
  const isLoading = debouncedSearchTerm ? isSearching : isLoadingArticles;
  const error = debouncedSearchTerm ? searchError : articlesError;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Articles</h1>
          <p className="text-muted-foreground mt-2">
            {debouncedSearchTerm
              ? `Search results for "${debouncedSearchTerm}"`
              : "Discover and explore our collection of articles"
            }
          </p>
        </div>
        <Button asChild className="w-fit">
          <Link href="/articles/create" className="flex items-center gap-2">
            <Plus className="size-4" />
            Create Article
          </Link>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
        <Input
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
          >
            ×
          </Button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-6">
          <CardContent className="text-center">
            <p className="text-destructive">
              Failed to load articles. Please try again later.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Articles Grid */}
      {data && !isLoading && (
        <>
          {data.data.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.data.map((article) => (
                <ArticleCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  excerpt={article.excerpt}
                  tags={article.tags}
                  createdAt={article.createdAt}
                  user={article.user}
                  status={article.status}
                  slug={article.slug}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12">
              <CardContent className="text-center space-y-4">
                <FileText className="size-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {debouncedSearchTerm ? "No articles found" : "No articles yet"}
                  </h3>
                  <p className="text-muted-foreground">
                    {debouncedSearchTerm
                      ? "Try adjusting your search terms or browse all articles."
                      : "Get started by creating your first article."
                    }
                  </p>
                </div>
                {!debouncedSearchTerm && (
                  <Button asChild>
                    <Link href="/articles/create">Create Your First Article</Link>
                  </Button>
                )}
                {debouncedSearchTerm && (
                  <Button variant="outline" onClick={clearSearch}>
                    View All Articles
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!data.pagination.hasPrev}
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!data.pagination.hasNext}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}