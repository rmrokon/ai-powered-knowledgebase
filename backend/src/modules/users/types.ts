import { Prisma, User } from "@prisma/client";
import { UserBodyValidationSchema } from "./validation";
import { z } from "zod";

export type IUser = User;
export type CreateUser = Prisma.UserCreateInput;
export type UpdateUser = Prisma.UserUpdateInput;

export type UserRequestBody = z.infer<typeof UserBodyValidationSchema>;
