import { ArticleStatus } from '@prisma/client';
import { z } from 'zod';

export const ArticleBodyValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.json(), // JSON content
  excerpt: z.string().optional(),
  slug: z.string().optional(),
  status: z.enum([ArticleStatus.DRAFT, ArticleStatus.PUBLISHED, ArticleStatus.ARCHIVED]).optional().default(ArticleStatus.PUBLISHED),
  tagIds: z.array(z.string()).optional(),
});

export const UpdateArticleBodyValidationSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  content: z.any().optional(), // JSON content
  excerpt: z.string().optional(),
  slug: z.string().optional(),
  status: z.enum([ArticleStatus.DRAFT, ArticleStatus.PUBLISHED, ArticleStatus.ARCHIVED]).optional(),
  tagIds: z.array(z.string()).optional(),
});
