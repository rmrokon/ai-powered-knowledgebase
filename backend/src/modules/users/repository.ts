import { PrismaClient, User } from '@prisma/client'
import { BaseRepository } from '../base-repo'
import { CreateUser, UpdateUser } from './types'

export class UserRepository extends BaseRepository<
  User,
  CreateUser,
  UpdateUser
> {
  constructor(db: PrismaClient) {
    super(db, 'user', {
    })
  }
}