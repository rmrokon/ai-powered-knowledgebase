import { PrismaClient, Tag } from '@prisma/client'
import { BaseRepository } from '../base-repo'
import { CreateTag, UpdateTag } from './types'

export class TagRepository extends BaseRepository<
  Tag,
  CreateTag,
  UpdateTag
> {
  constructor(db: PrismaClient) {
    super(db, 'tag', {
      include: {
        articles: {
          include: {
            article: true
          }
        }
      }
    })
  }
}
