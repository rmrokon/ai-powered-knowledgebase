import { Router } from 'express';
import {
  isAuthenticated,
  validateRequestBody,
} from '../../middlewares';
import { articleController } from '../bootstrap';
import {
  ArticleBodyValidationSchema,
  UpdateArticleBodyValidationSchema,
} from './validation';
import { asyncHandler } from '../../middlewares/errorHandlers';

export const ArticleRouter = Router();

ArticleRouter.route('/')
.get(
  asyncHandler(articleController.getAllArticles),
)
.post(
  [isAuthenticated, validateRequestBody(ArticleBodyValidationSchema)],
  asyncHandler(articleController.createArticle),
);

ArticleRouter.route('/users/:userId').get(
  [isAuthenticated],
  asyncHandler(articleController.getUserArticles),
);

ArticleRouter.route('/search').get(
  asyncHandler(articleController.searchArticles),
);

ArticleRouter.route('/slug/:slug').get(
  asyncHandler(articleController.getArticleBySlug),
);

ArticleRouter.route('/:id')
.get(
  asyncHandler(articleController.getArticleById),
)
.put(
  [isAuthenticated, validateRequestBody(UpdateArticleBodyValidationSchema)],
  asyncHandler(articleController.updateArticle),
)
.delete(
  [isAuthenticated],
  asyncHandler(articleController.deleteArticle),
);


ArticleRouter.route('/:id/publish').patch(
  [isAuthenticated],
  asyncHandler(articleController.publishArticle),
);

ArticleRouter.route('/:id/archive').patch(
  [isAuthenticated],
  asyncHandler(articleController.archiveArticle),
);
