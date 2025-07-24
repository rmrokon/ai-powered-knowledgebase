import { Prisma, PrismaClient } from '@prisma/client';
import { BaseRepository } from '../base-repo';
import { 
  CreateUser, 
  UpdateUser,
  IUser,
  UserRequestBody
} from './types';

export interface IUserService {
  createUser(args: UserRequestBody): Promise<IUser>;
  getUserById(id: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  updateUser(id: string, data: Partial<UserRequestBody>): Promise<IUser>;
  deleteUser(id: string): Promise<void>;
  getAllUsers(page?: number, limit?: number): Promise<{
    data: IUser[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }>;
  userExists(id: string): Promise<boolean>;
  userExistsByEmail(email: string): Promise<boolean>;
}

export class UserService implements IUserService {
  private userRepo: BaseRepository<IUser, CreateUser, UpdateUser>;
  private db: PrismaClient;

  constructor(
    userRepo: BaseRepository<IUser, CreateUser, UpdateUser>,
    db: PrismaClient
  ) {
    this.userRepo = userRepo;
    this.db = db;
  }

  async createUser(body: UserRequestBody): Promise<IUser> {
    try {
      const existingUser = await this.db.user.findUnique({
        where: { email: body.email }
      });

      if (existingUser) {
        throw new Error('User with same email address already exists!');
      }

      const user = await this.userRepo.create({
        email: body.email,
        firstName: body.firstName || '',
        lastName: body.lastName || '',
      }, {});

      return user;
    } catch (error) {
      throw new Error(`Failed to create user: ${error}`);
    }
  }

  async getUserById(id: string): Promise<IUser | null> {
    try {
      const user = await this.userRepo.findById(id);
      return user;
    } catch (error) {
      throw new Error(`Failed to get user: ${error}`);
    }
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await this.userRepo.findFirst({ email });
      return user;
    } catch (error) {
      throw new Error(`Failed to get user by email: ${error}`);
    }
  }

  async updateUser(id: string, data: Partial<UserRequestBody>): Promise<IUser> {
    try {
      const existingUser = await this.userRepo.findById(id);
      if (!existingUser) {
        throw new Error('User not found!');
      }

      if (data.email && data.email !== existingUser.email) {
        const emailExists = await this.userExistsByEmail(data.email);
        if (emailExists) {
          throw new Error('Email already in use by another user!');
        }
      }

      const updatedUser = await this.userRepo.update(id, data);
      return updatedUser;
    } catch (error) {
      throw new Error(`Failed to update user: ${error}`);
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.db.$transaction(async (tx: Prisma.TransactionClient) => {
        const user = await tx.user.findUnique({ where: { id } });
        if (!user) {
          throw new Error('User not found!');
        }

        await tx.user.delete({ where: { id } });
      });
    } catch (error) {
      throw new Error(`Failed to delete user: ${error}`);
    }
  }

  async getAllUsers(page: number = 1, limit: number = 10): Promise<{
    data: IUser[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    try {
      const result = await this.userRepo.findManyWithPagination(
        {}, 
        page,
        limit,
        { createdAt: 'desc' }
      );

      return result;
    } catch (error) {
      throw new Error(`Failed to get users: ${error}`);
    }
  }

  async userExists(id: string): Promise<boolean> {
    try {
      return await this.userRepo.exists(id);
    } catch (error) {
      throw new Error(`Failed to check user existence: ${error}`);
    }
  }

  async userExistsByEmail(email: string): Promise<boolean> {
    try {
      const count = await this.userRepo.count({ email });
      return count > 0;
    } catch (error) {
      throw new Error(`Failed to check user existence by email: ${error}`);
    }
  }

  async getUserWithArticles(id: string): Promise<IUser & { articles: any[] } | null> {
    try {
      const user = await this.db.user.findUnique({
        where: { id },
        include: { articles: true }
      });
      
      return user;
    } catch (error) {
      throw new Error(`Failed to get user with articles: ${error}`);
    }
  }

  async searchUsers(query: string, page: number = 1, limit: number = 10): Promise<{
    data: IUser[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    try {
      const whereClause = {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' as const } },
          { lastName: { contains: query, mode: 'insensitive' as const } },
          { email: { contains: query, mode: 'insensitive' as const } },
        ],
      };

      const result = await this.userRepo.findManyWithPagination(
        whereClause,
        page,
        limit,
        { createdAt: 'desc' }
      );

      return result;
    } catch (error) {
      throw new Error(`Failed to search users: ${error}`);
    }
  }
}
