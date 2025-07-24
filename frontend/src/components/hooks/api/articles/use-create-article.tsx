"use client"

import { articleRepository } from "@/lib/api/repositories";
import { IArticle, ICreateArticle } from "@/lib/api/repositories/article-repository";
import { api } from "@/lib/api/tanstack-adapter";
import { UseMutationOptions } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useCreateArticle = (
  options?: UseMutationOptions<IArticle, unknown, ICreateArticle, unknown>
) => {
  const queryClient = api.useQueryClient();
  const router = useRouter();
  
  return api.useMutation(
    articleRepository.createArticle.bind(articleRepository),
    {
      onSuccess: () => {
        toast.success("Article created successfully");
        queryClient.invalidateQueries({queryKey: ['user-articles']}); 
        router.push('/articles');
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to create article');
      },
      ...options
    }
  );
};