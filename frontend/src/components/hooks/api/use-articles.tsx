'use client'
import { articleRepository } from "@/lib/api/repositories";
import { api } from "@/lib/api/tanstack-adapter";
import { IArticle, ICreateArticle, IPaginationResponse } from "@/lib/api/repositories/article-repository";
import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Get all articles
export const useGetArticles = (
  page: number = 1, 
  limit: number = 10, 
  status?: string,
  options?: Omit<UseQueryOptions<IPaginationResponse<IArticle>>, 'queryKey' | 'queryFn'>
  ) => {
    return api.useQuery(
      ['articles', page, limit, status],
      () => articleRepository.getAllArticles(page, limit, status),
      {
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options
      }
    );
  };

export const useGetUserArticles = (
  page: number = 1, 
  limit: number = 10,
  options?: Omit<UseQueryOptions<IPaginationResponse<IArticle>>, 'queryKey' | 'queryFn'>
) => {
  return api.useQuery(
    ['user-articles', page, limit],
    () => articleRepository.getUserArticles(page, limit),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      ...options
    }
  );
};

export const useSearchArticles = (
  query: string,
  page: number = 1, 
  limit: number = 10,
  options?: Omit<UseQueryOptions<IPaginationResponse<IArticle>>, 'queryKey' | 'queryFn'>
) => {
  return api.useQuery(
    ['search-articles', query, page, limit],
    () => articleRepository.searchArticles(query, page, limit),
    {
      enabled: !!query && query.length > 0,
      staleTime: 2 * 60 * 1000, // 2 minutes for search results
      ...options
    }
  );
};

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
      staleTime: 10 * 60 * 1000, // 10 minutes
      ...options
    }
  );
};

export const useGetArticleBySlug = (
  slug: string,
  options?: Omit<UseQueryOptions<IArticle>, 'queryKey' | 'queryFn'>
) => {
  return api.useQuery(
    ['article-slug', slug],
    () => articleRepository.getArticleBySlug(slug),
    {
      enabled: !!slug,
      staleTime: 10 * 60 * 1000, // 10 minutes
      ...options
    }
  );
};

export const useCreateArticle = (
  options?: UseMutationOptions<IArticle, unknown, ICreateArticle, unknown>
) => {
  const queryClient = api.useQueryClient();
  
  return api.useMutation(
    articleRepository.createArticle.bind(articleRepository),
    {
      onSuccess: (data) => {
        toast.success("Article created successfully");
        queryClient.invalidateQueries({queryKey: ["articles"]});
        queryClient.invalidateQueries({queryKey: ['user-articles']});
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to create article');
      },
      ...options
    }
  );
};

export const useDeleteArticle = (
  options?: UseMutationOptions<void, unknown, string, unknown>
) => {
  const queryClient = api.useQueryClient();
  
  return api.useMutation(
    articleRepository.deleteArticle.bind(articleRepository),
    {
      onSuccess: () => {
        toast.success("Article deleted successfully");
        queryClient.invalidateQueries({queryKey: ['articles']});
        queryClient.invalidateQueries({queryKey: ['user-articles']});
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to delete article');
      },
      ...options
    }
  );
};

