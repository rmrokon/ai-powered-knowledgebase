import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../base-repo';
import { 
  CreateCredential, 
  UpdateCredential, 
  CredentialWithUser,
  ICredentialRequestBody,
  ILoginCredentialRequestBody,
  ICredentialTokenPayload
} from './types';
import { IUser } from '../users/types';

export interface ICredentialService {
  createCredential(args: ICredentialRequestBody): Promise<IUser>;
  verifyCredential(args: ILoginCredentialRequestBody): Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      name?: string;
    };
  }>;
  refreshCredential(args: Pick<ILoginCredentialRequestBody, 'email'>): Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      name?: string;
    };
  }>;
}

export class CredentialService implements ICredentialService {
  private credentialRepo: BaseRepository<any, CreateCredential, UpdateCredential>;
  private db: PrismaClient;

  constructor(
    credentialRepo: BaseRepository<any, CreateCredential, UpdateCredential>,
    db: PrismaClient
  ) {
    this.credentialRepo = credentialRepo;
    this.db = db;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private async createTokens(args: { 
    payload: ICredentialTokenPayload; 
    secret: string 
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const { payload, secret } = args;
    
    const accessToken = jwt.sign(
      payload, 
      process.env.JWT_SECRET! + secret, 
      {
        expiresIn: '24h',
      }
    );
    
    //created for later, currently not used
    const refreshToken = jwt.sign(
      { uid: payload.user.id }, 
      process.env.JWT_SECRET! + secret, 
      {
        expiresIn: '24h',
      }
    );

    //Will store in redis if get time later
    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string, secret: string): any {
    return jwt.verify(token, process.env.JWT_SECRET! + secret);
  }

  async getCredentialByUserId(userId: string): Promise<CredentialWithUser | null> {
    try {
      const credential = await this.credentialRepo.findFirst(
        { userId },
        { include: { user: true } }
      );
      return credential;
    } catch (error) {
      throw new Error(`Failed to get credential: ${error}`);
    }
  }

  async createCredential(body: ICredentialRequestBody): Promise<IUser> {
    try {
      return await this.db.$transaction(async (tx) => {
        const existingUser = await tx.user.findUnique({
          where: { email: body.email }
        });

        if (existingUser) {
          throw new Error('User with same email address already exists!');
        }

        const user = await tx.user.create({
          data: {
            email: body.email,
            firstName: body?.firstName || '',
            lastName: body?.lastName || '',
          }
        });

        const hashedPassword = await this.hashPassword(body.password);

        await tx.credential.create({
          data: {
            password: hashedPassword,
            userId: user.id,
          }
        });

        return user;
      });
    } catch (error) {
      throw new Error(`Failed to create credential: ${error}`);
    }
  }

  async verifyCredential(args: ILoginCredentialRequestBody): Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      name?: string;
    };
  }> {
    try {
      return await this.db.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: { email: args.email },
          include: { credential: true }
        });

        if (!user || !user.credential) {
          throw new Error('User not found!');
        }

        const isPasswordValid = await this.verifyPassword(
          args.password, 
          user.credential.password
        );

        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        const tokens = await this.createTokens({
          payload: {
            uid: user.id,
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
            }
          },
          secret: user.credential.password,
        });

        return {
          ...tokens,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName || undefined,
            lastName: user.lastName || undefined,
          }
        };
      });
    } catch (error) {
      throw new Error(`Failed to verify credential: ${error}`);
    }
  }

  async refreshCredential(args: Pick<ILoginCredentialRequestBody, 'email'>): Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      name?: string;
    };
  }> {
    try {
      return await this.db.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: { email: args.email },
          include: { credential: true }
        });

        if (!user || !user.credential) {
          throw new Error('User not found!');
        }

        //Will  Get cached data from Redis if using it


        const tokens = await this.createTokens({
          payload: {
            uid: user.id,
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
            }
          },
          secret: user.credential.password,
        });

        return {
          ...tokens,
          user: {
            id: user.id,
            email: user.email,
            firstName: `${user.firstName} ${user.lastName}` || undefined,
          lastName: user.lastName || undefined,
          }
        };
      });
    } catch (error) {
      throw new Error(`Failed to refresh credential: ${error}`);
    }
  }


  async updatePassword(userId: string, newPassword: string): Promise<void> {
    try {
      const hashedPassword = await this.hashPassword(newPassword);
      
      await this.credentialRepo.update(
        userId, // assuming credential ID = user ID, adjust if different
        { password: hashedPassword }
      );
    } catch (error) {
      throw new Error(`Failed to update password: ${error}`);
    }
  }

  async deleteCredential(userId: string): Promise<void> {
    try {
      await this.db.$transaction(async (tx) => {
        // Delete credential first (due to foreign key constraint)
        await tx.credential.delete({
          where: { userId }
        });
      });
    } catch (error) {
      throw new Error(`Failed to delete credential: ${error}`);
    }
  }
}