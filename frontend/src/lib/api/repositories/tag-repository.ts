import { HttpClient } from "../http-client";

export interface ITag {
  id: string;
  name: string;
  color?: string;
  slug: string;
  description?: string;
  createdAt: string;
}

export interface ICreateTag {
  name: string;
  description?: string;
  color?: string;
  slug?: string;
}

interface ITagApiResponse {
  success: boolean;
  data: ITag;
  message?: string;
}

interface ITagsApiResponse {
  success: boolean;
  data: ITag[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class TagRepository {
  constructor(private client: HttpClient) {}

  async getAllTags(page: number = 1, limit: number = 50): Promise<{ data: ITag[] }> {
    const params = { page, limit };
    const res = await this.client.get<ITagsApiResponse>('/tags', params);
    return {
      data: res.data
    };
  }

  async searchTags(query: string): Promise<{ data: ITag[] }> {
    const params = { q: query, limit: 20 };
    const res = await this.client.get<ITagsApiResponse>('/tags/search', params);
    return {
      data: res.data
    };
  }

  async createTag(data: ICreateTag): Promise<ITag> {
    const res = await this.client.post<ITagApiResponse>('/tags', data);
    return res.data;
  }

  async getTagById(id: string): Promise<ITag> {
    const res = await this.client.get<ITagApiResponse>(`/tags/${id}`);
    return res.data;
  }
}
