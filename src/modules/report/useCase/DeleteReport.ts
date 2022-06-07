import { AppError } from '@core/errors/AppError';
import ReportModel from '../ReportModel';

interface IRequest {
  reportId: string;
}

export default class DeleteReportsService {
  public async execute({ reportId }: IRequest): Promise<void> {
    const report = await ReportModel.findById(reportId);

    if (!report) {
      throw new AppError('Denúncia não encontrada.');
    }

    await ReportModel.findByIdAndDelete(reportId);

    return;
  }
}
