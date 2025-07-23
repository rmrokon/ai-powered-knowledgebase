import { Prisma, User, Article, Tag, ArticleTag } from "@prisma/client";
import { ArticleBodyValidationSchema, UpdateArticleBodyValidationSchema } from "./validation";
import { z } from "zod";

export type CreateArticle = Prisma.ArticleCreateInput;
export type UpdateArticle = Prisma.ArticleUpdateInput;
export type ArticleWithUser = Article & { user: User };
export type ArticleWithTags = Article & {
  user: User;
  tags: (ArticleTag & { tag: Tag })[];
};

export type IArticleRequestBody = z.infer<typeof ArticleBodyValidationSchema>;
export type IUpdateArticleRequestBody = z.infer<typeof UpdateArticleBodyValidationSchema>;