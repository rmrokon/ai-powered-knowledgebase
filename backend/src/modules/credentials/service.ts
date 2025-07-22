import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../base-repo';
import { 
  CreateCredential, 
  UpdateCredential, 
  CredentialWithUser,
  CreateUser,
  UserWithCredentials,
  ApiError,
  ICredentialRequestBody,
  ILoginCredentialRequestBody
} from './types';


export interface ICredentialTokenPayload {
  uid: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface ICredentialService {
  createCredential(args: ICredentialRequestBody): Promise<UserWithCredentials>;
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
  // private userRepo: BaseRepository<any, CreateUser, any>;
  private db: PrismaClient;

  constructor(
    credentialRepo: BaseRepository<any, CreateCredential, UpdateCredential>,
    // userRepo: BaseRepository<any, CreateUser, any>,
    db: PrismaClient
  ) {
    this.credentialRepo = credentialRepo;
    // this.userRepo = userRepo;
    this.db = db;
  }

  // Utility method to hash password
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  // Utility method to verify password
  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Utility method to create JWT tokens
  private async createTokens(args: { 
    payload: ICredentialTokenPayload; 
    secret: string 
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const { payload, secret } = args;
    
    const accessToken = jwt.sign(
      payload, 
      process.env.JWT_SECRET! + secret, 
      {
        expiresIn: '5m', // 5 minutes
      }
    );
    
    const refreshToken = jwt.sign(
      { uid: payload.user.id }, 
      process.env.JWT_SECRET! + secret, 
      {
        expiresIn: '24h', // 24 hours
      }
    );

    // Store in Redis if you're using it (optional)
    // await redisClient.setex(payload.user.id, 24 * 60 * 60, JSON.stringify(payload));

    return { accessToken, refreshToken };
  }

  // Utility method to verify access token
  verifyAccessToken(token: string, secret: string): any {
    return jwt.verify(token, process.env.JWT_SECRET! + secret);
  }

  // Get credential by user ID
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

  // Create new user with credentials
  async createCredential(body: ICredentialRequestBody): Promise<UserWithCredentials> {
    try {
      // Use Prisma transaction
      return await this.db.$transaction(async (tx) => {
        // Check if user already exists
        const existingUser = await tx.user.findUnique({
          where: { email: body.email }
        });

        if (existingUser) {
          throw new Error('User with same email address already exists!');
        }

        // Create user
        const user = await tx.user.create({
          data: {
            email: body.email,
            // Add other user fields as needed
          }
        });

        // Hash password
        const hashedPassword = await this.hashPassword(body.password);

        // Create credential
        await tx.credential.create({
          data: {
            password: hashedPassword,
            userId: user.id,
          }
        });

        // Return user with credentials
        const userWithCredentials = await tx.user.findUnique({
          where: { id: user.id },
          include: { credential: true }
        });

        return userWithCredentials as UserWithCredentials;
      });
    } catch (error) {
      throw new Error(`Failed to create credential: ${error}`);
    }
  }

  // Verify credentials and login
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
        // Find user with credential
        const user = await tx.user.findUnique({
          where: { email: args.email },
          include: { credential: true }
        });

        if (!user || !user.credential) {
          throw new Error('User not found!');
        }

        // Verify password
        const isPasswordValid = await this.verifyPassword(
          args.password, 
          user.credential.password
        );

        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        // Create tokens
        const tokens = await this.createTokens({
          payload: {
            uid: user.id,
            user: {
              id: user.id,
              email: user.email,
              name: `${user.firstName} ${user.lastName}` || undefined,
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

  // Refresh tokens
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
        // Find user with credential
        const user = await tx.user.findUnique({
          where: { email: args.email },
          include: { credential: true }
        });

        if (!user || !user.credential) {
          throw new Error('User not found!');
        }

        // Get cached data from Redis if using it
        // const redisRecord = await redisClient.get(user.id);
        // const parsedData = redisRecord ? JSON.parse(redisRecord) : {};

        // Create new tokens
        const tokens = await this.createTokens({
          payload: {
            uid: user.id,
            user: {
              id: user.id,
              email: user.email,
              name: `${user.firstName} ${user.lastName}` || undefined,
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

  // Additional utility methods

  // Update password
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

  // Delete credential (for user deletion)
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

  // Check if user exists by email
  async userExistsByEmail(email: string): Promise<boolean> {
    try {
      const count = await this.userRepo.count({ email });
      return count > 0;
    } catch (error) {
      throw new Error(`Failed to check user existence: ${error}`);
    }
  }

  // Get user by email with credentials
  async getUserByEmailWithCredential(email: string): Promise<UserWithCredentials | null> {
    try {
      const user = await this.db.user.findUnique({
        where: { email },
        include: { credential: true }
      });
      
      return user as UserWithCredentials | null;
    } catch (error) {
      throw new Error(`Failed to get user by email: ${error}`);
    }
  }
}

// Factory function to create the service
// export const createCredentialService = (
//   credentialRepo: BaseRepository<any, CreateCredential, UpdateCredential>,
//   userRepo: BaseRepository<any, CreateUser, any>,
//   db: PrismaClient
// ) => {
//   return new CredentialService(credentialRepo, userRepo, db);
// };