import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../base-repo';
import { 
  CreateTag, 
  UpdateTag, 
  ITagRequestBody,
  IUpdateTagRequestBody
} from './types';

export interface ITagService {
  createTag(data: ITagRequestBody): Promise<any>;
  getTagById(id: string): Promise<any | null>;
  getTagBySlug(slug: string): Promise<any | null>;
  updateTag(id: string, data: IUpdateTagRequestBody): Promise<any>;
  deleteTag(id: string): Promise<void>;
  getAllTags(page?: number, limit?: number): Promise<{
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
  addTagToArticle(articleId: string, tagId: string, userId: string): Promise<void>;
  removeTagFromArticle(articleId: string, tagId: string, userId: string): Promise<void>;
  getTagsByArticle(articleId: string): Promise<any[]>;
  searchTags(query: string, page?: number, limit?: number): Promise<{
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
}

export class TagService implements ITagService {
  private tagRepo: BaseRepository<any, CreateTag, UpdateTag>;
  private db: PrismaClient;

  constructor(
    tagRepo: BaseRepository<any, CreateTag, UpdateTag>,
    db: PrismaClient
  ) {
    this.tagRepo = tagRepo;
    this.db = db;
  }

  private generateSlug(name: string): string {
    return name
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
      const existing = await this.db.tag.findFirst({
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

  async createTag(data: ITagRequestBody): Promise<any> {
    try {
      // Check if tag with same name already exists
      const existingTag = await this.db.tag.findUnique({
        where: { name: data.name }
      });

      if (existingTag) {
        throw new Error('Tag with this name already exists');
      }

      // Generate slug if not provided
      const slug = data.slug || this.generateSlug(data.name);
      const uniqueSlug = await this.ensureUniqueSlug(slug);

      const tag = await this.db.tag.create({
        data: {
          name: data.name,
          slug: uniqueSlug,
          description: data.description,
          color: data.color,
        },
        include: {
          articles: {
            include: {
              article: true
            }
          }
        }
      });

      return tag;
    } catch (error) {
      throw new Error(`Failed to create tag: ${error}`);
    }
  }

  async getTagById(id: string): Promise<any | null> {
    try {
      const tag = await this.tagRepo.findById(id, {
        include: {
          articles: {
            include: {
              article: {
                include: {
                  user: true
                }
              }
            }
          }
        }
      });
      return tag;
    } catch (error) {
      throw new Error(`Failed to get tag: ${error}`);
    }
  }

  async getTagBySlug(slug: string): Promise<any | null> {
    try {
      const tag = await this.db.tag.findUnique({
        where: { slug },
        include: {
          articles: {
            include: {
              article: {
                include: {
                  user: true
                }
              }
            }
          }
        }
      });
      return tag;
    } catch (error) {
      throw new Error(`Failed to get tag by slug: ${error}`);
    }
  }

  async updateTag(id: string, data: IUpdateTagRequestBody): Promise<any> {
    try {
      // Check if tag exists
      const existingTag = await this.db.tag.findUnique({
        where: { id }
      });

      if (!existingTag) {
        throw new Error('Tag not found');
      }

      // Check if name is being updated and if it conflicts
      if (data.name && data.name !== existingTag.name) {
        const nameConflict = await this.db.tag.findFirst({
          where: { 
            name: data.name,
            id: { not: id }
          }
        });

        if (nameConflict) {
          throw new Error('Tag with this name already exists');
        }
      }

      // Prepare update data
      const updateData: any = {};
      
      if (data.name !== undefined) {
        updateData.name = data.name;
        // Update slug if name changed
        if (data.slug === undefined) {
          const newSlug = this.generateSlug(data.name);
          updateData.slug = await this.ensureUniqueSlug(newSlug, id);
        }
      }
      
      if (data.description !== undefined) updateData.description = data.description;
      if (data.color !== undefined) updateData.color = data.color;
      if (data.slug !== undefined) {
        updateData.slug = await this.ensureUniqueSlug(data.slug, id);
      }

      const tag = await this.db.tag.update({
        where: { id },
        data: updateData,
        include: {
          articles: {
            include: {
              article: {
                include: {
                  user: true
                }
              }
            }
          }
        }
      });

      return tag;
    } catch (error) {
      throw new Error(`Failed to update tag: ${error}`);
    }
  }

  async deleteTag(id: string): Promise<void> {
    try {
      // Check if tag exists
      const tag = await this.db.tag.findUnique({
        where: { id }
      });

      if (!tag) {
        throw new Error('Tag not found');
      }

      // Delete tag (article associations will be deleted automatically due to cascade)
      await this.db.tag.delete({
        where: { id }
      });
    } catch (error) {
      throw new Error(`Failed to delete tag: ${error}`);
    }
  }

  async getAllTags(page: number = 1, limit: number = 10): Promise<{
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
      
      const [tags, total] = await Promise.all([
        this.db.tag.findMany({
          include: {
            articles: {
              include: {
                article: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.db.tag.count()
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: tags,
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
      throw new Error(`Failed to get tags: ${error}`);
    }
  }

  async addTagToArticle(articleId: string, tagId: string, userId: string): Promise<void> {
    try {
      await this.db.$transaction(async (tx) => {
        // Check if article exists and belongs to user
        const article = await tx.article.findFirst({
          where: { id: articleId, userId }
        });

        if (!article) {
          throw new Error('Article not found or access denied');
        }

        // Check if tag exists
        const tag = await tx.tag.findUnique({
          where: { id: tagId }
        });

        if (!tag) {
          throw new Error('Tag not found');
        }

        // Check if association already exists
        const existingAssociation = await tx.articleTag.findUnique({
          where: {
            articleId_tagId: {
              articleId,
              tagId
            }
          }
        });

        if (existingAssociation) {
          throw new Error('Tag is already associated with this article');
        }

        // Create association
        await tx.articleTag.create({
          data: {
            articleId,
            tagId
          }
        });
      });
    } catch (error) {
      throw new Error(`Failed to add tag to article: ${error}`);
    }
  }

  async removeTagFromArticle(articleId: string, tagId: string, userId: string): Promise<void> {
    try {
      await this.db.$transaction(async (tx) => {
        // Check if article exists and belongs to user
        const article = await tx.article.findFirst({
          where: { id: articleId, userId }
        });

        if (!article) {
          throw new Error('Article not found or access denied');
        }

        // Check if association exists
        const association = await tx.articleTag.findUnique({
          where: {
            articleId_tagId: {
              articleId,
              tagId
            }
          }
        });

        if (!association) {
          throw new Error('Tag is not associated with this article');
        }

        // Remove association
        await tx.articleTag.delete({
          where: {
            articleId_tagId: {
              articleId,
              tagId
            }
          }
        });
      });
    } catch (error) {
      throw new Error(`Failed to remove tag from article: ${error}`);
    }
  }

  async getTagsByArticle(articleId: string): Promise<any[]> {
    try {
      const articleTags = await this.db.articleTag.findMany({
        where: { articleId },
        include: {
          tag: true
        }
      });

      return articleTags.map(at => at.tag);
    } catch (error) {
      throw new Error(`Failed to get tags for article: ${error}`);
    }
  }

  async searchTags(query: string, page: number = 1, limit: number = 10): Promise<{
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

      const [tags, total] = await Promise.all([
        this.db.tag.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ]
          },
          include: {
            articles: {
              include: {
                article: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.db.tag.count({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ]
          }
        })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: tags,
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
      throw new Error(`Failed to search tags: ${error}`);
    }
  }
}
