import { Router } from 'express';
import ArticleCommentController from './ArticleCommentController';

const ArticleCommentRoutes = Router();

const articleController = new ArticleCommentController();

ArticleCommentRoutes.get(
  '/get-by-article/:articleId',
  articleController.getByArticle,
);
ArticleCommentRoutes.post('/', articleController.create);

export default ArticleCommentRoutes;
