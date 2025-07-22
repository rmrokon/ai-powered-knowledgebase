import { Credential, Prisma, User } from "@prisma/client";
import { CredentialBodyValidationSchema, LoginCredentialBodyValidationSchema } from "./validation";
import { z } from "zod";
import { IUser } from "../users/types";

export type CreateCredential = Prisma.CredentialCreateInput;
export type UpdateCredential = Prisma.CredentialUpdateInput;
export type CredentialWithUser = Credential & { user: User };

export type ICredentialRequestBody = z.infer<typeof CredentialBodyValidationSchema>;
export type ILoginCredentialRequestBody = z.infer<typeof LoginCredentialBodyValidationSchema>;

export interface ICredentialTokenPayload {
  uid: string;
  user: Omit<IUser, 'createdAt'>;
}