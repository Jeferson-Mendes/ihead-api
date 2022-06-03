import { Router } from 'express';
import ArticleCommentController from './ArticleCommentController';

const ArticleCommentRoutes = Router();

const articleController = new ArticleCommentController();

ArticleCommentRoutes.get(
  '/get-by-article/:articleId',
  articleController.getByArticle,
);
ArticleCommentRoutes.post('/', articleController.create);
ArticleCommentRoutes.post(
  '/add-favorite/:articleCommentId',
  articleController.addFavoriteComment,
);
ArticleCommentRoutes.delete(
  '/delete-favorite/:articleCommentId',
  articleController.removeFavoriteComment,
);

ArticleCommentRoutes.delete('/delete/:commentId', articleController.delete);

export default ArticleCommentRoutes;
