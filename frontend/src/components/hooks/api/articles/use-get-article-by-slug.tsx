'use client'
import { articleRepository } from "@/lib/api/repositories";
import { api } from "@/lib/api/tanstack-adapter";
import { IArticle } from "@/lib/api/repositories/article-repository";
import { UseQueryOptions } from "@tanstack/react-query";


export const useGetArticleBySlug = (
  slug: string,
  options?: Omit<UseQueryOptions<IArticle>, 'queryKey' | 'queryFn'>
) => {
  return api.useQuery(
    ['article-slug', slug],
    () => articleRepository.getArticleBySlug(slug),
    {
      enabled: !!slug,
      ...options
    }
  );
};