"use client"

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { X, Plus, Search, Loader2 } from "lucide-react";
import { useSearchTags, useCreateTag } from "@/components/hooks/api/use-tags";
import { useDebouncedSearch } from "@/components/hooks/use-debounced-search";
import { ITag } from "@/lib/api/repositories/tag-repository";

interface TagSelectorProps {
  selectedTagIds: string[];
  onTagsChange: (tagIds: string[]) => void;
  label?: string;
  placeholder?: string;
}

export function TagSelector({ 
  selectedTagIds, 
  onTagsChange, 
  label = "Tags",
  placeholder = "Search or create tags..."
}: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<ITag[]>([]);
  const { searchTerm, debouncedSearchTerm, setSearchTerm } = useDebouncedSearch("", 300);

  const { data: searchResults, isLoading: isSearching } = useSearchTags(debouncedSearchTerm, {
    enabled: isOpen && debouncedSearchTerm.length > 0
  });

  const createTagMutation = useCreateTag({
    onSuccess: (newTag) => {
      const newTagIds = [...selectedTagIds, newTag.id];
      const newSelectedTags = [...selectedTags, newTag];
      setSelectedTags(newSelectedTags);
      onTagsChange(newTagIds);
      setSearchTerm("");
      setIsOpen(false);
    }
  });

  // Load selected tags info (you might want to add a hook to get tags by IDs)
  useEffect(() => {
    // For now, we'll just keep the selected tags in local state
    // In a real app, you might want to fetch tag details by IDs
  }, [selectedTagIds]);

  const handleTagSelect = (tag: ITag) => {
    if (!selectedTagIds.includes(tag.id)) {
      const newTagIds = [...selectedTagIds, tag.id];
      const newSelectedTags = [...selectedTags, tag];
      setSelectedTags(newSelectedTags);
      onTagsChange(newTagIds);
    }
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleTagRemove = (tagId: string) => {
    const newTagIds = selectedTagIds.filter(id => id !== tagId);
    const newSelectedTags = selectedTags.filter(tag => tag.id !== tagId);
    setSelectedTags(newSelectedTags);
    onTagsChange(newTagIds);
  };

  const handleCreateTag = () => {
    if (debouncedSearchTerm.trim()) {
      createTagMutation.mutate({
        name: debouncedSearchTerm.trim(),
        description: `Tag created for: ${debouncedSearchTerm.trim()}`
      });
    }
  };

  const filteredResults = searchResults?.data?.filter(
    tag => !selectedTagIds.includes(tag.id)
  ) || [];

  const showCreateOption = debouncedSearchTerm.length > 0 && 
    !filteredResults.some(tag => tag.name.toLowerCase() === debouncedSearchTerm.toLowerCase());

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge 
              key={tag.id} 
              variant="secondary" 
              className="flex items-center gap-1 pr-1"
              style={tag.color ? { 
                borderColor: tag.color + '40',
                color: tag.color 
              } : {}}
            >
              {tag.name}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => handleTagRemove(tag.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10"
        />
      </div>

      {/* Dropdown Results */}
      {isOpen && (debouncedSearchTerm.length > 0 || searchTerm.length > 0) && (
        <Card className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto">
          <CardContent className="p-2">
            {isSearching && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              </div>
            )}

            {!isSearching && filteredResults.length > 0 && (
              <div className="space-y-1">
                {filteredResults.map((tag) => (
                  <Button
                    key={tag.id}
                    variant="ghost"
                    className="w-full justify-start h-auto p-2"
                    onClick={() => handleTagSelect(tag)}
                  >
                    <Badge 
                      variant="outline" 
                      className="mr-2"
                      style={tag.color ? { 
                        borderColor: tag.color + '40',
                        color: tag.color 
                      } : {}}
                    >
                      {tag.name}
                    </Badge>
                    {tag.description && (
                      <span className="text-xs text-muted-foreground truncate">
                        {tag.description}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            )}

            {!isSearching && showCreateOption && (
              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-2 border-t"
                onClick={handleCreateTag}
                disabled={createTagMutation.isPending}
              >
                {createTagMutation.isPending ? (
                  <Loader2 className="size-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="size-4 mr-2" />
                )}
                Create "{debouncedSearchTerm}"
              </Button>
            )}

            {!isSearching && filteredResults.length === 0 && !showCreateOption && debouncedSearchTerm.length > 0 && (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No tags found
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
