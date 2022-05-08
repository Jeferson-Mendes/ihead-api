import { Router } from 'express';
import ArticleController from './ArticleController';
import uploadConfig from '@core/config/multer';

const ArticleRoutes = Router();

const articleController = new ArticleController();

ArticleRoutes.get('/', articleController.list);
ArticleRoutes.get('/:id', articleController.detail);
ArticleRoutes.get('/by-user/:userId', articleController.getArticlesByUser);
ArticleRoutes.post('/', uploadConfig.single('file'), articleController.create);

export default ArticleRoutes;
