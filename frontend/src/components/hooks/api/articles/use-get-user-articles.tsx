'use client'
import { articleRepository } from "@/lib/api/repositories";
import { api } from "@/lib/api/tanstack-adapter";
import { IArticle, IPaginationResponse } from "@/lib/api/repositories/article-repository";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetUserArticles = (
  page: number = 1,
  limit: number = 10,
  tagIds?: string[],
  options?: Omit<UseQueryOptions<IPaginationResponse<IArticle>>, 'queryKey' | 'queryFn'>
) => {
  return api.useQuery(
    ['user-articles'],
    () => articleRepository.getUserArticles(page, limit, tagIds),
    {
    //   staleTime: 5 * 60 * 1000, // 5 minutes
      ...options
    }
  );
};