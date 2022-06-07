import { Auth } from '@modules/auth/decorators/Auth';
import { IsModerator } from '@modules/auth/decorators/IsModerator';
import { Request, Response } from 'express';
import CreateReportService from './useCase/CreateReport';
import DeleteReportsService from './useCase/DeleteReport';
import ListReportsService from './useCase/ListReports';
import RemoveArticleOrCommentReported from './useCase/RemoveArticleOrCommentReported';

export default class ReportController {
  @Auth
  @IsModerator
  public async list(req: Request, res: Response): Promise<Response> {
    const { limit, page } = req.query;

    const listReport = new ListReportsService();

    const { reports, reportsNumber } = await listReport.execute({
      limit: Number(limit),
      page: Number(page),
    });

    return res.json({ reports, reportsNumber, status: 200 });
  }

  @Auth
  public async create(req: Request, res: Response): Promise<Response> {
    const { comment, publication, reason } = req.body;

    const createReport = new CreateReportService();

    const report = await createReport.execute({ comment, publication, reason });

    return res.json({ report, status: 200 });
  }

  @Auth
  @IsModerator
  public async deleteArticleOrComment(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { reportId } = req.params;

    const removeArticleOrCommentReported = new RemoveArticleOrCommentReported();

    await removeArticleOrCommentReported.execute({ reportId });

    return res.status(204).json();
  }

  @Auth
  @IsModerator
  public async deleteReport(req: Request, res: Response): Promise<Response> {
    const { reportId } = req.params;

    const deleteReport = new DeleteReportsService();

    await deleteReport.execute({ reportId });

    return res.status(204).json();
  }
}
