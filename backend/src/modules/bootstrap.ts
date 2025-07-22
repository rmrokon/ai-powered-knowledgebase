// bootstrap/index.ts
import { PrismaClient, User, Credential, Article, Prisma } from '@prisma/client';
import { UserRepository } from './users/repository';
import { UserService } from './users/service';
// import UserController from './users/controller';
import { CredentialRepository } from './credentials/repository';
import { CredentialService } from './credentials/service';
import CredentialController from './credentials/controller';

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
