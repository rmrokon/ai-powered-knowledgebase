'use client'
import { QueryKey, useMutation, UseMutationOptions, useQuery, UseQueryOptions, useQueryClient } from "@tanstack/react-query";

export const api = {
  useQuery<TData>(
    queryKey: QueryKey,
    queryFn: () => Promise<TData>,
    options?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>
  ) {
    return useQuery<TData>({
      queryKey,
      queryFn,
      ...options,
    });
  },

  useMutation<TData, TError = unknown, TVariables = void>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options?: UseMutationOptions<TData, TError, TVariables>
  ) {
    return useMutation<TData, TError, TVariables>({
      mutationFn,
      ...options,
    });
  },
  useQueryClient() {
    return useQueryClient();
  },
}