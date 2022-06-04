import { AppError } from '@core/errors/AppError';
import ArticleModel from '@modules/article/ArticleModel';
import ArticleCommentModel from '@modules/ArticleComment/ArticleCommentModel';
import UserModel from '@modules/user/UserModel';
import ReportModel, { Report } from '../ReportModel';

interface IRequest {
  publication?: string;
  comment?: string;
  reason: string;
}

export default class CreateReportService {
  public async execute({
    publication,
    comment,
    reason,
  }: IRequest): Promise<Report | undefined> {
    if (publication && comment) {
      throw new AppError(
        'Você não deve denunciar publicação e comentário de uma só vez.',
      );
    }

    if (publication) {
      const publicationExists = await ArticleModel.findById(publication);

      if (!publicationExists) {
        throw new AppError('Publicação não encontrada.');
      }

      const data = {
        denounced: publicationExists.author,
        type: 'Article',
        publication,
        reason,
      };

      const createdReport = await ReportModel.create(data);

      await UserModel.findByIdAndUpdate(publicationExists.author, {
        $inc: { reportsReceived: 1 },
      });

      publicationExists.reportsReceived += 1;
      await publicationExists.save();

      return createdReport;
    } else if (comment) {
      const commentExists = await ArticleCommentModel.findById(comment);

      if (!commentExists) {
        throw new AppError('Comentário não encontrado.');
      }

      const data = {
        denounced: commentExists.user,
        type: 'Comment',
        comment,
        reason,
      };

      const createdReport = await ReportModel.create(data);

      await UserModel.findByIdAndUpdate(commentExists.user, {
        $inc: { reportsReceived: 1 },
      });

      commentExists.reportsReceived += 1;
      await commentExists.save();

      return createdReport;
    }
  }
}
