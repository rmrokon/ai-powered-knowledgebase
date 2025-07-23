import { HttpClient } from "../http-client";

export interface ITag {
  id: string;
  name: string;
  color?: string;
  slug: string;
  description?: string;
  createdAt: string;
}

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export interface IArticle {
  id: string;
  title: string;
  content: any; // JSON content
  excerpt: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: IUser;
  tags: { tag: ITag }[];
}

export interface ICreateArticle {
  title: string;
  content: any;
  excerpt?: string;
  slug?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  tagIds?: string[];
}

export interface IUpdateArticle {
  title?: string;
  content?: any;
  excerpt?: string;
  slug?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  tagIds?: string[];
}

export interface IPaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface IArticleApiResponse {
  success: boolean;
  data: IArticle;
  message?: string;
}

interface IArticlesApiResponse {
  success: boolean;
  data: IArticle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class ArticleRepository {
  constructor(private client: HttpClient) {}

  async getAllArticles(page: number = 1, limit: number = 10, status?: string): Promise<IPaginationResponse<IArticle>> {
    const params: any = { page, limit };
    if (status) params.status = status;
    
    const res = await this.client.get<IArticlesApiResponse>('/articles', params);
    return {
      data: res.data,
      pagination: res.pagination
    };
  }

  async getUserArticles(page: number = 1, limit: number = 10): Promise<IPaginationResponse<IArticle>> {
    const params = { page, limit };
    const res = await this.client.get<IArticlesApiResponse>('/articles/my-articles', params);
    return {
      data: res.data,
      pagination: res.pagination
    };
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

  async updateArticle(id: string, data: IUpdateArticle): Promise<IArticle> {
    const res = await this.client.put<IArticleApiResponse>(`/articles/${id}`, data);
    return res.data;
  }

  async deleteArticle(id: string): Promise<void> {
    await this.client.delete(`/articles/${id}`);
  }

  async publishArticle(id: string): Promise<IArticle> {
    const res = await this.client.post<IArticleApiResponse>(`/articles/${id}/publish`, {});
    return res.data;
  }

  async archiveArticle(id: string): Promise<IArticle> {
    const res = await this.client.post<IArticleApiResponse>(`/articles/${id}/archive`, {});
    return res.data;
  }

  async summarizeArticle(id: string): Promise<{ summary: string }> {
    const res = await this.client.post<{ success: boolean; data: { summary: string } }>(`/articles/${id}/summarize`, {});
    return res.data;
  }
}
