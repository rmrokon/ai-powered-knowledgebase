import { Prisma, Article } from "@prisma/client";
import { UserBodyValidationSchema } from "./validation";
import { z } from "zod";

export type IArticle = Article;
export type CreateUser = Prisma.ArticleCreateInput;
export type UpdateUser = Prisma.ArticleUpdateInput;

export type UserRequestBody = z.infer<typeof UserBodyValidationSchema>;
