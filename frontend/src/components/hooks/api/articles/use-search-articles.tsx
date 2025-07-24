'use client'
import { articleRepository } from "@/lib/api/repositories";
import { api } from "@/lib/api/tanstack-adapter";
import { IArticle, IPaginationResponse } from "@/lib/api/repositories/article-repository";
import { UseQueryOptions } from "@tanstack/react-query";

// Search user articles
export const useSearchUserArticles = (
  query: string,
  page: number = 1,
  limit: number = 10,
  options?: Omit<UseQueryOptions<IPaginationResponse<IArticle>>, 'queryKey' | 'queryFn'>
) => {
  return api.useQuery(
    ['search-user-articles', query, page, limit],
    () => articleRepository.searchUserArticles(query, page, limit),
    {
      enabled: !!query && query.length > 0,
      staleTime: 2 * 60 * 1000, // 2 minutes for search results
      ...options
    }
  );
};