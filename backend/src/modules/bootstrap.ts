// bootstrap/index.ts
import { PrismaClient, User, Credential, Article, Prisma } from '@prisma/client';
import { UserRepository } from './users/repository';
import { UserService } from './users/service';
// import UserController from './users/controller';
import { CredentialRepository } from './credentials/repository';
import { CredentialService } from './credentials/service';
import CredentialController from './credentials/controller';
import { ArticleRepository } from './articles/repository';
import { ArticleService } from './articles/service';
import ArticleController from './articles/controller';
import { TagRepository } from './tags/repository';
import { TagService } from './tags/service';
import TagController from './tags/controller';

// Initialize Prisma Client (singleton)
export const db = new PrismaClient();

// =============================================================================
// USER MODULE
// =============================================================================
export const userRepository = new UserRepository(db);
export const userService = new UserService(userRepository, db);
// export const userController = new UserController(userService);

// =============================================================================
// CREDENTIAL MODULE
// =============================================================================
export const credentialRepository = new CredentialRepository(db);
export const credentialService = new CredentialService(
  credentialRepository, 
  db
);
export const credentialController = new CredentialController(credentialService);

// =============================================================================
// ARTICLE MODULE
// =============================================================================
export const articleRepository = new ArticleRepository(db);
export const articleService = new ArticleService(articleRepository, db);
export const articleController = new ArticleController(articleService);

// =============================================================================
// TAG MODULE
// =============================================================================
export const tagRepository = new TagRepository(db);
export const tagService = new TagService(tagRepository, db);
export const tagController = new TagController(tagService);

// =============================================================================
// CLEANUP FUNCTION
// =============================================================================
export const cleanup = async () => {
  await db.$disconnect();
};

// Handle process termination
process.on('beforeExit', cleanup);
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// =============================================================================
// HEALTH CHECK
// =============================================================================
export const healthCheck = async () => {
  try {
    await db.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Auto-run health check on import
healthCheck();
