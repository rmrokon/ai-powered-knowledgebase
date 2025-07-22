import { z } from "zod";

export const UserBodyValidationSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().min(1, "Email is required"),
});

