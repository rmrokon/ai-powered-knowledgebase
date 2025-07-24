/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from "../http-client";
import { IUser } from "./user-repository";

export interface ITag {
  id: string;
  name: string;
  color?: string;
  slug: string;
  description?: string;
  createdAt: string;
}

export enum ArticleStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export interface IArticle {
  id: string;
  title: string;
  content: any; // JSON content
  excerpt: string;
  slug: string;
  status: ArticleStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: IUser;
  tags: { tag: ITag }[];
}

export type ICreateArticle = Omit<IArticle, "id" | "createdAt" | "updatedAt" | "publishedAt" | "userId" | "user" | "tags">

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};
export interface IPaginationResponse<T> {
  data: T[];
  pagination: IPagination;
}

interface IArticleApiResponse {
  success: boolean;
  data: IArticle;
  message?: string;
}

interface IArticlesApiResponse {
  success: boolean;
  data: IArticle[];
  pagination: IPagination;
}

export class ArticleRepository {
  constructor(private client: HttpClient) { }

  async getUserArticles(page: number, limit: number, tagIds?: string[]): Promise<IPaginationResponse<IArticle>> {
    const params: any = { page, limit };
    if (tagIds && tagIds.length > 0) {
      params.tagIds = tagIds.join(',');
    }
    console.log('getUserArticles API call with params:', params);
    const res = await this.client.get<IArticlesApiResponse>('/articles/my-articles', params);
    const articlesDTO = {
      data: res.data.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        slug: item.slug,
        excerpt: item.excerpt,
        status: item.status,
        userId: item.userId,
        user: item.user,
        tags: item.tags,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        publishedAt: item.publishedAt
      })),
      pagination: {
        page: res.pagination.page,
        limit: res.pagination.limit,
        total: res.pagination.total,
        totalPages: res.pagination.totalPages,
        hasNext: res.pagination.hasNext,
        hasPrev: res.pagination.hasPrev
      }
    }
    return articlesDTO;
  }

  async searchArticles(query: string, page: number = 1, limit: number = 10): Promise<IPaginationResponse<IArticle>> {
    const params = { q: query, page, limit };
    const res = await this.client.get<IArticlesApiResponse>('/articles/search', params);
    return {
      data: res.data,
      pagination: res.pagination
    };
  }

  async searchUserArticles(query: string, page: number = 1, limit: number = 10): Promise<IPaginationResponse<IArticle>> {
    const params = { q: query, page, limit };
    const res = await this.client.get<IArticlesApiResponse>('/articles/my-articles/search', params);
    return {
      data: res.data,
      pagination: res.pagination
    };
  }

  async getArticleById(id: string): Promise<IArticle> {
    const res = await this.client.get<IArticleApiResponse>(`/articles/${id}`);
    return res.data;
  }

  async getArticleBySlug(slug: string): Promise<IArticle> {
    const res = await this.client.get<IArticleApiResponse>(`/articles/slug/${slug}`);
    return res.data;
  }

  async createArticle(data: ICreateArticle): Promise<IArticle> {
    const res = await this.client.post<IArticleApiResponse>('/articles', data);
    return res.data;
  }

  async deleteArticle(id: string): Promise<void> {
    await this.client.delete(`/articles/${id}`);
  }

  async summarizeArticle(id: string): Promise<{ summary: string }> {
    const res = await this.client.post<{ success: boolean; data: { summary: string } }>(`/articles/${id}/summarize`, {});
    return res.data;
  }
}
