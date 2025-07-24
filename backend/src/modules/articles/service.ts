import { ArticleStatus, Prisma, PrismaClient } from '@prisma/client';
import { BaseRepository } from '../base-repo';
import {
  CreateArticle,
  UpdateArticle,
  ArticleWithUser,

  IArticleRequestBody,
  IUpdateArticleRequestBody
} from './types';
import askAi from '../../lib/openrouter';

export interface IArticleService {
  createArticle(userId: string, data: IArticleRequestBody): Promise<any>;
  getArticleById(id: string): Promise<any | null>;
  getArticleBySlug(slug: string): Promise<any | null>;
  updateArticle(id: string, userId: string, data: IUpdateArticleRequestBody): Promise<any>;
  deleteArticle(id: string, userId: string): Promise<void>;
  getUserArticles(userId: string, page?: number, limit?: number, tagIds?: string[]): Promise<{
    data: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }>;
  getAllArticles(page?: number, limit?: number, status?: string): Promise<{
    data: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }>;
  publishArticle(id: string, userId: string): Promise<any>;
  archiveArticle(id: string, userId: string): Promise<any>;
  searchArticles(query: string, page?: number, limit?: number): Promise<{
    data: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }>;
  searchUserArticles(query: string, userId: string, page?: number, limit?: number): Promise<{
    data: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }>;
  summarizeArticle(id: string, userId: string): Promise<{ summary: string }>;
}

export class ArticleService implements IArticleService {
  private articleRepo: BaseRepository<any, CreateArticle, UpdateArticle>;
  private db: PrismaClient;

  constructor(
    articleRepo: BaseRepository<any, CreateArticle, UpdateArticle>,
    db: PrismaClient
  ) {
    this.articleRepo = articleRepo;
    this.db = db;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await this.db.article.findFirst({
        where: {
          slug,
          ...(excludeId && { id: { not: excludeId } })
        }
      });

      if (!existing) {
        return slug;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  private generateExcerpt(content: any): string {
    if (typeof content === 'string') {
      return content.substring(0, 200) + (content.length > 200 ? '...' : '');
    }

    // If content is JSON/rich text, try to extract plain text
    if (typeof content === 'object' && content !== null) {
      const textContent = JSON.stringify(content).replace(/<[^>]*>/g, '');
      return textContent.substring(0, 200) + (textContent.length > 200 ? '...' : '');
    }

    return '';
  }

  async createArticle(userId: string, data: IArticleRequestBody): Promise<any> {
    try {
      return await this.db.$transaction(async (tx: Prisma.TransactionClient) => {
        // Generate slug if not provided
        const slug = data.slug || this.generateSlug(data.title);
        const uniqueSlug = await this.ensureUniqueSlug(slug);

        // Generate excerpt if not provided
        const excerpt = data.excerpt || this.generateExcerpt(data.content);

        // Create the article
        const article = await tx.article.create({
          data: {
            title: data.title,
            content: data.content ?? '',
            excerpt,
            slug: uniqueSlug,
            status: data.status || ArticleStatus.PUBLISHED,
            userId,
            publishedAt: data.status === ArticleStatus.PUBLISHED ? new Date() : null,
          },
          include: {
            user: true,
            tags: {
              include: {
                tag: true
              }
            }
          }
        });

        // Handle tags if provided
        if (data.tagIds && data.tagIds.length > 0) {
          await tx.articleTag.createMany({
            data: data.tagIds.map(tagId => ({
              articleId: article.id,
              tagId
            }))
          });

          // Fetch the article with tags
          const articleWithTags = await tx.article.findUnique({
            where: { id: article.id },
            include: {
              user: true,
              tags: {
                include: {
                  tag: true
                }
              }
            }
          });

          return articleWithTags!;
        }

        return article;
      });
    } catch (error) {
      throw new Error(`Failed to create article: ${error}`);
    }
  }

  async getArticleById(id: string): Promise<any | null> {
    try {
      const article = await this.articleRepo.findById(id, {
        include: {
          user: true,
          tags: {
            include: {
              tag: true
            }
          }
        }
      });
      return article;
    } catch (error) {
      throw new Error(`Failed to get article: ${error}`);
    }
  }

  async getArticleBySlug(slug: string): Promise<any | null> {
    try {
      const article = await this.db.article.findUnique({
        where: { slug },
        include: {
          user: true,
          tags: {
            include: {
              tag: true
            }
          }
        }
      });
      return article;
    } catch (error) {
      throw new Error(`Failed to get article by slug: ${error}`);
    }
  }

  async updateArticle(id: string, userId: string, data: IUpdateArticleRequestBody): Promise<any> {
    try {
      return await this.db.$transaction(async (tx: Prisma.TransactionClient) => {
        // Check if article exists and belongs to user
        const existingArticle = await tx.article.findFirst({
          where: { id, userId }
        });

        if (!existingArticle) {
          throw new Error('Article not found or access denied');
        }

        // Prepare update data
        const updateData: any = {};

        if (data.title !== undefined) {
          updateData.title = data.title;
          // Update slug if title changed
          if (data.slug === undefined) {
            const newSlug = this.generateSlug(data.title);
            updateData.slug = await this.ensureUniqueSlug(newSlug, id);
          }
        }

        if (data.content !== undefined) {
          updateData.content = data.content;
          // Update excerpt if content changed and excerpt not provided
          if (data.excerpt === undefined) {
            updateData.excerpt = this.generateExcerpt(data.content);
          }
        }

        if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
        if (data.slug !== undefined) {
          updateData.slug = await this.ensureUniqueSlug(data.slug, id);
        }

        if (data.status !== undefined) {
          updateData.status = data.status;
          // Set publishedAt when publishing
          if (data.status === ArticleStatus.PUBLISHED && (existingArticle as any).status !== ArticleStatus.PUBLISHED) {
            updateData.publishedAt = new Date();
          }
        }

        // Update the article
        const article = await tx.article.update({
          where: { id },
          data: updateData,
          include: {
            user: true,
            tags: {
              include: {
                tag: true
              }
            }
          }
        });

        // Handle tags if provided
        if (data.tagIds !== undefined) {
          // Remove existing tags
          await tx.articleTag.deleteMany({
            where: { articleId: id }
          });

          // Add new tags
          if (data.tagIds.length > 0) {
            await tx.articleTag.createMany({
              data: data.tagIds.map(tagId => ({
                articleId: id,
                tagId
              }))
            });
          }

          // Fetch updated article with tags
          const updatedArticle = await tx.article.findUnique({
            where: { id },
            include: {
              user: true,
              tags: {
                include: {
                  tag: true
                }
              }
            }
          });

          return updatedArticle!;
        }

        return article;
      });
    } catch (error) {
      throw new Error(`Failed to update article: ${error}`);
    }
  }

  async deleteArticle(id: string, userId: string): Promise<void> {
    try {
      await this.db.$transaction(async (tx: Prisma.TransactionClient) => {
        // Check if article exists and belongs to user
        const article = await tx.article.findFirst({
          where: { id, userId }
        });

        if (!article) {
          throw new Error('Article not found or access denied');
        }

        // Delete article (tags will be deleted automatically due to cascade)
        await tx.article.delete({
          where: { id }
        });
      });
    } catch (error) {
      throw new Error(`Failed to delete article: ${error}`);
    }
  }

  async getUserArticles(userId: string, page: number = 1, limit: number = 10, tagIds?: string[]): Promise<{
    data: any[];
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
      const skip = (page - 1) * limit;

      // Build where clause
      const whereClause: any = { userId };

      // Add tag filtering if tagIds are provided
      if (tagIds && tagIds.length > 0) {
        whereClause.tags = {
          some: {
            tagId: {
              in: tagIds
            }
          }
        };
      }

      const [articles, total] = await Promise.all([
        this.db.article.findMany({
          where: whereClause,
          include: {
            user: true,
            tags: {
              include: {
                tag: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.db.article.count({ where: whereClause })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: articles,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        }
      };
    } catch (error) {
      throw new Error(`Failed to get user articles: ${error}`);
    }
  }

  async getAllArticles(page: number = 1, limit: number = 10, status?: string): Promise<{
    data: any[];
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
      const skip = (page - 1) * limit;

      const [articles, total] = await Promise.all([
        this.db.article.findMany({
          include: {
            user: true,
            tags: {
              include: {
                tag: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.db.article.count()
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: articles,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        }
      };
    } catch (error) {
      throw new Error(`Failed to get articles: ${error}`);
    }
  }

  async publishArticle(id: string, userId: string): Promise<any> {
    try {
      return await this.updateArticle(id, userId, {
        status: ArticleStatus.PUBLISHED
      });
    } catch (error) {
      throw new Error(`Failed to publish article: ${error}`);
    }
  }

  async archiveArticle(id: string, userId: string): Promise<any> {
    try {
      return await this.updateArticle(id, userId, {
        status: 'ARCHIVED'
      });
    } catch (error) {
      throw new Error(`Failed to archive article: ${error}`);
    }
  }

  async searchArticles(query: string, page: number = 1, limit: number = 10): Promise<{
    data: any[];
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
      const skip = (page - 1) * limit;

      const [articles, total] = await Promise.all([
        this.db.article.findMany({
          where: {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { excerpt: { contains: query, mode: 'insensitive' } },
              {
                tags: {
                  some: {
                    tag: {
                      name: { contains: query, mode: 'insensitive' }
                    }
                  }
                }
              }
            ]
          },
          include: {
            user: true,
            tags: {
              include: {
                tag: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.db.article.count({
          where: {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { excerpt: { contains: query, mode: 'insensitive' } },
              {
                tags: {
                  some: {
                    tag: {
                      name: { contains: query, mode: 'insensitive' }
                    }
                  }
                }
              }
            ]
          }
        })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: articles,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        }
      };
    } catch (error) {
      throw new Error(`Failed to search articles: ${error}`);
    }
  }

  async searchUserArticles(query: string, userId: string, page: number = 1, limit: number = 10): Promise<{
    data: any[];
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
      const skip = (page - 1) * limit;

      const [articles, total] = await Promise.all([
        this.db.article.findMany({
          where: {
            userId,
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { excerpt: { contains: query, mode: 'insensitive' } },
              {
                tags: {
                  some: {
                    tag: {
                      name: { contains: query, mode: 'insensitive' }
                    }
                  }
                }
              }
            ]
          },
          include: {
            user: true,
            tags: {
              include: {
                tag: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.db.article.count({
          where: {
            userId,
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { excerpt: { contains: query, mode: 'insensitive' } },
              {
                tags: {
                  some: {
                    tag: {
                      name: { contains: query, mode: 'insensitive' }
                    }
                  }
                }
              }
            ]
          }
        })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: articles,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        }
      };
    } catch (error) {
      throw new Error(`Failed to search user articles: ${error}`);
    }
  }

  async summarizeArticle(id: string, userId: string): Promise<{ summary: string }> {
    try {
      const article = await this.db.article.findFirst({
        where: { id, userId }
      });

      if (!article) {
        throw new Error('Article not found or access denied');
      }

      let textContent = '';
      if (typeof article.content === 'string') {
        textContent = article.content;
      } else if (typeof article.content === 'object' && article.content !== null) {
        textContent = JSON.stringify(article.content);
      }

      const prompt = `
        Please provide a concise summary of the following article. Your summary should:

1. Capture the main argument or central thesis
2. Include the most important supporting points and evidence
3. Maintain the original tone and perspective
4. Be approximately 5-7 sentences long
5. Use clear, accessible language

Focus on what a reader would need to know to understand the article's core message and key takeaways. Avoid including minor details, examples used solely for illustration, or tangential information.

Article title: ${article.title}
Article: ${textContent}
      `

      // For now, return a simple summary (you can integrate OpenRouter here)
      const res = await askAi({
        model: 'deepseek/deepseek-r1-0528:free',
        prompt
      })
      let summary = '';
      if(!res?.content){
        summary = `This is a summary of the article "${article.title}". ${article.excerpt || 'The article contains valuable information and insights.'}`;
      }
      else summary = res.content;

      return { summary };
    } catch (error) {
      throw new Error(`Failed to summarize article: ${error}`);
    }
  }
}