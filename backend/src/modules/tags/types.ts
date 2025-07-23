import { Prisma, Tag, Article, ArticleTag } from "@prisma/client";
import { TagBodyValidationSchema, UpdateTagBodyValidationSchema } from "./validation";
import { z } from "zod";

export type CreateTag = Prisma.TagCreateInput;
export type UpdateTag = Prisma.TagUpdateInput;
export type TagWithArticles = Tag & { 
  articles: (ArticleTag & { article: Article })[];
};

export type ITagRequestBody = z.infer<typeof TagBodyValidationSchema>;
export type IUpdateTagRequestBody = z.infer<typeof UpdateTagBodyValidationSchema>;
