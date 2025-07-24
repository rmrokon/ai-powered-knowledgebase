import { Request, Response } from 'express';
import { IArticleRequestBody, IUpdateArticleRequestBody } from './types';
import { IArticleService } from './service';

export default class ArticleController {
  _service: IArticleService;

  constructor(service: IArticleService) {
    this._service = service;
  }

  createArticle = async (req: Request, res: Response) => {
    try {
      const body = req.body as IArticleRequestBody;
      const userId = req.auth.user.id;
      console.log({body});
      const article = await this._service.createArticle(userId, body);
      return res.status(201).json({
        success: true,
        data: article,
        message: 'Article created successfully'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create article'
      });
    }
  };

  getArticleById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const article = await this._service.getArticleById(id);

      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Article not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: article
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get article'
      });
    }
  };

  getArticleBySlug = async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;

      const article = await this._service.getArticleBySlug(slug);

      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Article not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: article
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get article'
      });
    }
  };

  updateArticle = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const body = req.body as IUpdateArticleRequestBody;
      const userId = req.auth.user.id;

      const article = await this._service.updateArticle(id, userId, body);

      return res.status(200).json({
        success: true,
        data: article,
        message: 'Article updated successfully'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update article'
      });
    }
  };

  deleteArticle = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.auth.user.id;

      await this._service.deleteArticle(id, userId);

      return res.status(200).json({
        success: true,
        message: 'Article deleted successfully'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete article'
      });
    }
  };

  getUserArticles = async (req: Request, res: Response) => {
    try {
      const {userId} = req.params as {userId: string};
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this._service.getUserArticles(userId, page, limit);

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get user articles'
      });
    }
  };

  getMyArticles = async (req: Request, res: Response) => {
    try {
      const userId = req.auth.user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // Parse tagIds from query parameter
      let tagIds: string[] | undefined;
      if (req.query.tagIds) {
        if (typeof req.query.tagIds === 'string') {
          tagIds = req.query.tagIds.split(',').filter(id => id.trim());
        } else if (Array.isArray(req.query.tagIds)) {
          tagIds = req.query.tagIds.filter(id => typeof id === 'string' && id.trim()) as string[];
        }
      }

      const result = await this._service.getUserArticles(userId, page, limit, tagIds);

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        message: 'My articles retrieved successfully'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get my articles'
      });
    }
  };

  getAllArticles = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;

      const result = await this._service.getAllArticles(page, limit, status);

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get articles'
      });
    }
  };

  publishArticle = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.auth.user.id;

      const article = await this._service.publishArticle(id, userId);

      return res.status(200).json({
        success: true,
        data: article,
        message: 'Article published successfully'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to publish article'
      });
    }
  };

  archiveArticle = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.auth.user.id;

      const article = await this._service.archiveArticle(id, userId);

      return res.status(200).json({
        success: true,
        data: article,
        message: 'Article archived successfully'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to archive article'
      });
    }
  };

  searchArticles = async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const result = await this._service.searchArticles(query, page, limit);

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to search articles'
      });
    }
  };

  searchMyArticles = async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const userId = req.auth.user.id;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const result = await this._service.searchUserArticles(query, userId, page, limit);

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        message: 'My articles searched successfully'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to search my articles'
      });
    }
  };

  summarizeArticle = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.auth.user.id;

      const result = await this._service.summarizeArticle(id, userId);

      return res.status(200).json({
        success: true,
        data: result,
        message: 'Article summarized successfully'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to summarize article'
      });
    }
  };
}