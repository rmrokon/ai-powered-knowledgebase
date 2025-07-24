'use client'
import { articleRepository } from "@/lib/api/repositories";
import { api } from "@/lib/api/tanstack-adapter";
import { IArticle } from "@/lib/api/repositories/article-repository";
import { UseQueryOptions } from "@tanstack/react-query";




// Get article by ID
export const useGetArticle = (
  id: string,
  options?: Omit<UseQueryOptions<IArticle>, 'queryKey' | 'queryFn'>
) => {
  return api.useQuery(
    ['article', id],
    () => articleRepository.getArticleById(id),
    {
      enabled: !!id,
      ...options
    }
  );
};