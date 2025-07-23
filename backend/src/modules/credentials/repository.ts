import { PrismaClient, User, Prisma } from '@prisma/client'
import { BaseRepository } from '../base-repo'
import { CreateCredential, UpdateCredential } from './types'

export class CredentialRepository extends BaseRepository<
  Credential,
  CreateCredential,
  UpdateCredential
> {
  constructor(db: PrismaClient) {
    super(db, 'credential', {
    })
  }
}