import { PrismaClient, Article } from '@prisma/client'
import { BaseRepository } from '../base-repo'
import { CreateArticle, UpdateArticle } from './types'

export class ArticleRepository extends BaseRepository<
  Article,
  CreateArticle,
  UpdateArticle
> {
  constructor(db: PrismaClient) {
    super(db, 'article', {
      include: {
        user: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    })
  }
}