"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Loader2, FileText, Copy, Check } from "lucide-react";
import { useSummarizeArticle } from "@/components/hooks/api/use-articles";

interface ArticleSummaryModalProps {
  articleId: string;
  articleTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ArticleSummaryModal({ 
  articleId, 
  articleTitle, 
  isOpen, 
  onClose 
}: ArticleSummaryModalProps) {
  const [summary, setSummary] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const summarizeMutation = useSummarizeArticle({
    onSuccess: (data) => {
      setSummary(data.summary);
    }
  });

  const handleSummarize = () => {
    setSummary("");
    summarizeMutation.mutate(articleId);
  };

  const handleCopy = async () => {
    if (summary) {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setSummary("");
    summarizeMutation.reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50" 
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5" />
              Article Summary
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8"
            >
              <X className="size-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Article Title */}
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium text-sm text-muted-foreground mb-1">Article:</p>
              <p className="font-semibold">{articleTitle}</p>
            </div>

            {/* Summary Content */}
            <div className="min-h-[200px]">
              {!summary && !summarizeMutation.isPending && (
                <div className="text-center py-12 space-y-4">
                  <FileText className="size-12 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="font-semibold text-foreground">Generate Summary</h3>
                    <p className="text-muted-foreground text-sm">
                      Click the button below to generate an AI-powered summary of this article.
                    </p>
                  </div>
                  <Button onClick={handleSummarize}>
                    Generate Summary
                  </Button>
                </div>
              )}

              {summarizeMutation.isPending && (
                <div className="text-center py-12 space-y-4">
                  <Loader2 className="size-12 animate-spin text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="font-semibold text-foreground">Generating Summary...</h3>
                    <p className="text-muted-foreground text-sm">
                      Please wait while we analyze and summarize the article content.
                    </p>
                  </div>
                </div>
              )}

              {summary && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Summary</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        className="flex items-center gap-2"
                      >
                        {copied ? (
                          <>
                            <Check className="size-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="size-4" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSummarize}
                        disabled={summarizeMutation.isPending}
                      >
                        Regenerate
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg max-h-[300px] overflow-y-auto">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {summary.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-3 last:mb-0 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {summarizeMutation.isError && (
                <div className="text-center py-12 space-y-4">
                  <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                    <X className="size-6 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Failed to Generate Summary</h3>
                    <p className="text-muted-foreground text-sm">
                      There was an error generating the summary. Please try again.
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleSummarize}>
                    Try Again
                  </Button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
