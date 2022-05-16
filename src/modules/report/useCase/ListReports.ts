import ReportModel, { Report } from '../ReportModel';

interface IRequest {
  limit?: number;
  page?: number;
}

export default class ListReportsService {
  public async execute({ limit, page }: IRequest): Promise<Report[]> {
    const paramLimit = parseInt(String(limit)) || 10;
    const paramPage = parseInt(String(page)) || 1;
    const skip = paramLimit * (paramPage - 1);

    const reports = await ReportModel.find().limit(paramLimit).skip(skip);

    return reports;
  }
}