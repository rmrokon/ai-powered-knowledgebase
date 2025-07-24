import { z } from 'zod';

export const TagBodyValidationSchema = z.object({
  name: z.string().min(1, "Tag name is required").max(50, "Tag name must be less than 50 characters"),
  description: z.string().max(200, "Description must be less than 200 characters").optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex color").optional(),
  slug: z.string().optional(),
});

export const UpdateTagBodyValidationSchema = z.object({
  name: z.string().min(1, "Tag name is required").max(50, "Tag name must be less than 50 characters").optional(),
  description: z.string().max(200, "Description must be less than 200 characters").optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex color").optional(),
  slug: z.string().optional(),
});

export const AddTagToArticleSchema = z.object({
  tagId: z.string().uuid("Invalid tag ID"),
});

export const RemoveTagFromArticleSchema = z.object({
  tagId: z.string().uuid("Invalid tag ID"),
});
