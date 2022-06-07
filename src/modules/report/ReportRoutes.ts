import { Router } from 'express';
import ReportController from './ReportController';
import { createReportValidator } from './ReportValidators';

const reportController = new ReportController();

const ReportRoutes = Router();

ReportRoutes.get('/', reportController.list);
ReportRoutes.post('/', createReportValidator, reportController.create);
ReportRoutes.delete('/:reportId', reportController.deleteReport);
ReportRoutes.delete(
  '/resolve/:reportId',
  reportController.deleteArticleOrComment,
);

export default ReportRoutes;
