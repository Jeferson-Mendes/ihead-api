import { Router } from 'express';
import ArticleRoutes from '@modules/article/ArticleRoutes';
import UserRoutes from '@modules/user/UserRoutes';
import ArticleCommentRoutes from '@modules/ArticleComment/ArticleCommentRoutes';
import ReportRoutes from '@modules/report/ReportRoutes';

const routes = Router();

routes.use('/users', UserRoutes);
routes.use('/articles', ArticleRoutes);
routes.use('/comments', ArticleCommentRoutes);
routes.use('/reports', ReportRoutes);

export default routes;
