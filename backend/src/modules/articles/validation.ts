import { z } from "zod";

export const ArticleBodyValidationSchema = z.object({
  title: z.string("Title is required"),
  content: z.json("Content is required"),
  tags: z.array(z.string()).optional(),
});

