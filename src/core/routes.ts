import { Router } from 'express';
import ArticleRoutes from '@modules/article/ArticleRoutes';
import UserRoutes from '@modules/user/UserRoutes';
import ArticleCommentRoutes from '@modules/ArticleComment/ArticleCommentRoutes';

const routes = Router();

routes.use('/users', UserRoutes);
routes.use('/articles', ArticleRoutes);
routes.use('/comments', ArticleCommentRoutes);

export default routes;
