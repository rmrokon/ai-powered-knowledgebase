'use client'
import { articleRepository } from "@/lib/api/repositories";
import { api } from "@/lib/api/tanstack-adapter";
import { UseMutationOptions } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Summarize article
export const useSummarizeArticle = (
  options?: UseMutationOptions<{ summary: string }, unknown, string, unknown>
) => {
  return api.useMutation(
    articleRepository.summarizeArticle.bind(articleRepository),
    {
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to summarize article');
      },
      ...options
    }
  );
};