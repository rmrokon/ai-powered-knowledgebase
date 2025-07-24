"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, Loader2, FileText } from "lucide-react";
import Link from "next/link";
import ArticleCard from "./articles-card";
import { useDebouncedSearch } from "@/components/hooks/use-debounced-search";
import { TagFilter } from "@/components/ui/tag-filter";
import { useGetUserArticles } from "@/components/hooks/api/articles/use-get-user-articles";
import { useSearchUserArticles } from "@/components/hooks/api/articles/use-search-articles";

export default function Articles() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const { searchTerm, debouncedSearchTerm, setSearchTerm } = useDebouncedSearch("", 500);

  const {
    data: articlesData,
    isLoading: isLoadingArticles,
    error: articlesError
  } = useGetUserArticles(currentPage, 5, selectedTagIds, {
    enabled: !debouncedSearchTerm,
  });

  const {
    data: searchData,
    isLoading: isSearching,
    error: searchError
  } = useSearchUserArticles(debouncedSearchTerm, currentPage, 12, {
    enabled: !!debouncedSearchTerm
  });

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

  const handleTagsChange = (tagIds: string[]) => {
    setSelectedTagIds(tagIds);
    setCurrentPage(1);
  };

  const handleSetSearchTerm = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setSearchTerm(e.target.value)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Articles</h1>
          <p className="text-muted-foreground mt-2">
            {debouncedSearchTerm
              ? `Search results for "${debouncedSearchTerm}"`
              : selectedTagIds.length > 0
                ? `Showing articles filtered by ${selectedTagIds.length} tag${selectedTagIds.length > 1 ? 's' : ''}`
                : "Discover and explore your articles"
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

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            placeholder="Search articles by title, content, or tags..."
            value={searchTerm}
            onChange={handleSetSearchTerm}
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

        {/* Tag Filter */}
        <TagFilter
          selectedTagIds={selectedTagIds}
          onTagsChange={handleTagsChange}
          className="w-full sm:w-auto"
        />
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
                    {debouncedSearchTerm
                      ? "No articles found"
                      : selectedTagIds.length > 0
                        ? "No articles with selected tags"
                        : "No articles yet"
                    }
                  </h3>
                  <p className="text-muted-foreground">
                    {debouncedSearchTerm
                      ? "Try adjusting your search terms or browse all articles."
                      : selectedTagIds.length > 0
                        ? "Try selecting different tags or create a new article with these tags."
                        : "Get started by creating your first article."
                    }
                  </p>
                </div>
                {!debouncedSearchTerm && selectedTagIds.length === 0 && (
                  <Button asChild>
                    <Link href="/articles/create">Create Your First Article</Link>
                  </Button>
                )}
                {(debouncedSearchTerm || selectedTagIds.length > 0) && (
                  <div className="flex gap-2">
                    {debouncedSearchTerm && (
                      <Button variant="outline" onClick={clearSearch}>
                        Clear Search
                      </Button>
                    )}
                    {selectedTagIds.length > 0 && (
                      <Button variant="outline" onClick={() => handleTagsChange([])}>
                        Clear Filters
                      </Button>
                    )}
                  </div>
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