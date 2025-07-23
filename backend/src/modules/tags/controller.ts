import { Request, Response } from 'express';
import { ITagRequestBody, IUpdateTagRequestBody } from './types';
import { ITagService } from './service';

export default class TagController {
  _service: ITagService;

  constructor(service: ITagService) {
    this._service = service;
  }

  createTag = async (req: Request, res: Response) => {
    try {
      const body = req.body as ITagRequestBody;
      
      const tag = await this._service.createTag(body);
      return res.status(201).json({
        success: true,
        data: tag,
        message: 'Tag created successfully'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create tag'
      });
    }
  };

  getTagById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const tag = await this._service.getTagById(id);
      
      if (!tag) {
        return res.status(404).json({
          success: false,
          message: 'Tag not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: tag
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get tag'
      });
    }
  };

  getTagBySlug = async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      
      const tag = await this._service.getTagBySlug(slug);
      
      if (!tag) {
        return res.status(404).json({
          success: false,
          message: 'Tag not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: tag
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get tag'
      });
    }
  };

  updateTag = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const body = req.body as IUpdateTagRequestBody;
      
      const tag = await this._service.updateTag(id, body);
      
      return res.status(200).json({
        success: true,
        data: tag,
        message: 'Tag updated successfully'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update tag'
      });
    }
  };

  deleteTag = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      await this._service.deleteTag(id);
      
      return res.status(200).json({
        success: true,
        message: 'Tag deleted successfully'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete tag'
      });
    }
  };

  getAllTags = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this._service.getAllTags(page, limit);
      
      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get tags'
      });
    }
  };

  addTagToArticle = async (req: Request, res: Response) => {
    try {
      const { articleId } = req.params;
      const { tagId } = req.body;
      const userId = req.auth.user.id;
      
      await this._service.addTagToArticle(articleId, tagId, userId);
      
      return res.status(200).json({
        success: true,
        message: 'Tag added to article successfully'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to add tag to article'
      });
    }
  };

  removeTagFromArticle = async (req: Request, res: Response) => {
    try {
      const { articleId, tagId } = req.params;
      const userId = req.auth.user.id;
      
      await this._service.removeTagFromArticle(articleId, tagId, userId);
      
      return res.status(200).json({
        success: true,
        message: 'Tag removed from article successfully'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to remove tag from article'
      });
    }
  };

  getTagsByArticle = async (req: Request, res: Response) => {
    try {
      const { articleId } = req.params;
      
      const tags = await this._service.getTagsByArticle(articleId);
      
      return res.status(200).json({
        success: true,
        data: tags
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get article tags'
      });
    }
  };

  searchTags = async (req: Request, res: Response) => {
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
      
      const result = await this._service.searchTags(query, page, limit);
      
      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to search tags'
      });
    }
  };
}
