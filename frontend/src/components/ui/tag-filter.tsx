"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, X, Filter } from "lucide-react";
import { useGetTags } from "@/components/hooks/api/use-tags";
import { ITag } from "@/lib/api/repositories/tag-repository";

interface TagFilterProps {
  selectedTagIds: string[];
  onTagsChange: (tagIds: string[]) => void;
  className?: string;
}

export function TagFilter({ selectedTagIds, onTagsChange, className }: TagFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: tagsData, isLoading } = useGetTags();
  
  const tags = tagsData?.data || [];
  const selectedTags = tags.filter(tag => selectedTagIds.includes(tag.id));

  const handleTagToggle = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onTagsChange(selectedTagIds.filter(id => id !== tagId));
    } else {
      onTagsChange([...selectedTagIds, tagId]);
    }
  };

  const clearAllTags = () => {
    onTagsChange([]);
  };

  const availableTags = tags.filter(tag => !selectedTagIds.includes(tag.id));

  return (
    <div className={`relative ${className}`}>
      {/* Filter Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 min-w-[120px] justify-between"
      >
        <div className="flex items-center gap-2">
          <Filter className="size-4" />
          <span>Tags</span>
          {selectedTagIds.length > 0 && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0.5 min-w-[20px] h-5">
              {selectedTagIds.length}
            </Badge>
          )}
        </div>
        <ChevronDown className={`size-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selectedTags.map((tag) => (
            <Badge 
              key={tag.id} 
              variant="secondary" 
              className="flex items-center gap-1 pr-1 cursor-pointer hover:bg-secondary/80"
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
                onClick={() => handleTagToggle(tag.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {selectedTags.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllTags}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          )}
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <Card className="absolute z-50 w-full min-w-[300px] mt-1 max-h-80 overflow-hidden">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  Loading tags...
                </div>
              ) : availableTags.length > 0 ? (
                <div className="max-h-80 overflow-y-auto">
                  <div className="p-2 border-b bg-muted/50">
                    <p className="text-xs font-medium text-muted-foreground">
                      Select tags to filter articles
                    </p>
                  </div>
                  <div className="p-2 space-y-1">
                    {availableTags.map((tag) => (
                      <Button
                        key={tag.id}
                        variant="ghost"
                        className="w-full justify-start h-auto p-2 hover:bg-muted"
                        onClick={() => handleTagToggle(tag.id)}
                      >
                        <Badge 
                          variant="outline" 
                          className="mr-2 pointer-events-none"
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
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    {selectedTagIds.length > 0 ? 'All tags selected' : 'No tags available'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
