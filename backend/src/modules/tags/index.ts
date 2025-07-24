import { Router } from 'express';
import {
  isAuthenticated,
  validateRequestBody,
} from '../../middlewares';
import { tagController } from '../bootstrap';
import {
  TagBodyValidationSchema,
  UpdateTagBodyValidationSchema,
  AddTagToArticleSchema,
} from './validation';
import { asyncHandler } from '../../middlewares/errorHandlers';

export const TagRouter = Router();

// Create tag
TagRouter.route('/')
.get(
  asyncHandler(tagController.getAllTags),
)
.post(
  [validateRequestBody(TagBodyValidationSchema)],
  asyncHandler(tagController.createTag),
);

// Search tags
TagRouter.route('/search').get(
  asyncHandler(tagController.searchTags),
);

// Get tag by slug (public)
TagRouter.route('/slug/:slug').get(
  asyncHandler(tagController.getTagBySlug),
);

// Get tag by ID, Update tag, Delete tag
TagRouter.route('/:id')
.get(
  asyncHandler(tagController.getTagById),
)
.put(
  [validateRequestBody(UpdateTagBodyValidationSchema)],
  asyncHandler(tagController.updateTag),
)
.delete(
  asyncHandler(tagController.deleteTag),
);

// Article-Tag association routes
TagRouter.route('/articles/:articleId')
.get(
  asyncHandler(tagController.getTagsByArticle),
)
.post(
  [isAuthenticated, validateRequestBody(AddTagToArticleSchema)],
  asyncHandler(tagController.addTagToArticle),
);

// Remove tag from article
TagRouter.route('/articles/:articleId/:tagId').delete(
  [isAuthenticated],
  asyncHandler(tagController.removeTagFromArticle),
);
