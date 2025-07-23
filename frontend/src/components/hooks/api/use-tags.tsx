'use client'
import { tagRepository } from "@/lib/api/repositories";
import { api } from "@/lib/api/tanstack-adapter";
import { ITag, ICreateTag } from "@/lib/api/repositories/tag-repository";
import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Get all tags
export const useGetTags = (
  options?: Omit<UseQueryOptions<{ data: ITag[] }>, 'queryKey' | 'queryFn'>
) => {
  return api.useQuery(
    ['tags'],
    () => tagRepository.getAllTags(),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      ...options
    }
  );
};

// Search tags
export const useSearchTags = (
  query: string,
  options?: Omit<UseQueryOptions<{ data: ITag[] }>, 'queryKey' | 'queryFn'>
) => {
  return api.useQuery(
    ['search-tags', query],
    () => tagRepository.searchTags(query),
    {
      enabled: !!query && query.length > 0,
      staleTime: 5 * 60 * 1000, // 5 minutes for search results
      ...options
    }
  );
};

// Create tag
export const useCreateTag = (
  options?: UseMutationOptions<ITag, unknown, ICreateTag, unknown>
) => {
  const queryClient = api.useQueryClient();
  
  return api.useMutation(
    tagRepository.createTag.bind(tagRepository),
    {
      onSuccess: (data) => {
        toast.success("Tag created successfully");
        // Invalidate and refetch tags
        queryClient.invalidateQueries({ queryKey: ['tags'] });
        queryClient.invalidateQueries({ queryKey: ['search-tags'] });
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to create tag');
      },
      ...options
    }
  );
};
