import { Auth } from '@modules/auth/decorators/Auth';
import { Request, Response } from 'express';
import CreateReportService from './useCase/CreateReport';
import ListReportsService from './useCase/ListReports';

export default class ReportController {
  @Auth
  public async list(req: Request, res: Response): Promise<Response> {
    const { limit, page } = req.query;

    const listReport = new ListReportsService();

    const reports = await listReport.execute({
      limit: Number(limit),
      page: Number(page),
    });

    return res.json({ reports, status: 200 });
  }

  @Auth
  public async create(req: Request, res: Response): Promise<Response> {
    const { comment, publication, reason } = req.body;

    const createReport = new CreateReportService();

    const report = await createReport.execute({ comment, publication, reason });

    return res.json({ report, status: 200 });
  }
}
