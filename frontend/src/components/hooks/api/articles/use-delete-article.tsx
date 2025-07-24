'use client'
import { articleRepository } from "@/lib/api/repositories";
import { api } from "@/lib/api/tanstack-adapter";
import { UseMutationOptions } from "@tanstack/react-query";
import toast from "react-hot-toast";



export const useDeleteArticle = (
  options?: UseMutationOptions<void, unknown, string, unknown>
) => {
  const queryClient = api.useQueryClient();

  return api.useMutation(
    articleRepository.deleteArticle.bind(articleRepository),
    {
      onSuccess: () => {
        toast.success("Article deleted successfully");
        queryClient.invalidateQueries({queryKey: ['user-articles']});
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to delete article');
      },
      ...options
    }
  );
};