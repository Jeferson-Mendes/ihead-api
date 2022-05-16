import { Router } from 'express';
import ReportController from './ReportController';

const reportController = new ReportController();

const ReportRoutes = Router();

ReportRoutes.get('/', reportController.list);
ReportRoutes.post('/', reportController.create);

export default ReportRoutes;
