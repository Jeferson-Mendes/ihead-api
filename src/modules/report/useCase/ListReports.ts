import ReportModel, { Report } from '../ReportModel';

interface IRequest {
  limit?: number;
  page?: number;
}

export default class ListReportsService {
  public async execute({
    limit,
    page,
  }: IRequest): Promise<{ reports: Report[]; reportsNumber: number }> {
    const paramLimit = parseInt(String(limit)) || 10;
    const paramPage = parseInt(String(page)) || 1;
    const skip = paramLimit * (paramPage - 1);

    const reports = await ReportModel.find()
      .populate({
        path: 'denounced',
        select: 'name picture email phoneNumber',
        populate: { path: 'resource' },
      })
      .populate('publication', 'title category')
      .populate({
        path: 'comment',
        populate: { path: 'article', select: 'title' },
      })
      .limit(paramLimit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const reportsNumber = await ReportModel.find().count();

    return { reports, reportsNumber };
  }
}
