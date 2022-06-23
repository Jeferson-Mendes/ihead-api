import { AppError } from '@core/errors/AppError';
import ArticleModel from '@modules/article/ArticleModel';
import ArticleCommentModel from '@modules/ArticleComment/ArticleCommentModel';
import UserModel from '@modules/user/UserModel';
import ReportModel from '../ReportModel';

interface IRequest {
  reportId: string;
}

export default class RemoveArticleOrCommentReported {
  public async execute({ reportId }: IRequest): Promise<void> {
    const report = await ReportModel.findById(reportId);

    if (!report) {
      throw new AppError('Denúncia não encontrada.');
    }

    const user = await UserModel.findById(report.denounced);

    if (!user) {
      throw new AppError('Autor não encontrado');
    }

    if (report.publication) {
      const article = await ArticleModel.findById(report.publication);

      if (!article) {
        throw new AppError('Artigo não encontrado.');
      }

      await ArticleModel.findByIdAndDelete(report.publication);

      if (user.contributionTotalHours - 60 < 0) {
        user.contributionTotalHours = 0; // minutes;
      } else {
        user.contributionTotalHours -= 60; // minutes;
      }

      await user.save();

      await ReportModel.deleteMany({ publication: report.publication });

      return;
    } else if (report.comment) {
      const comment = await ArticleCommentModel.findById(report.comment);

      if (!comment) {
        throw new AppError('Comentário não encontrado.');
      }

      await ArticleCommentModel.findByIdAndDelete(report.comment);

      if (user.contributionTotalHours - 5 < 0) {
        user.contributionTotalHours = 0; // minutes;
      } else {
        user.contributionTotalHours -= 5; // minutes;
      }

      await user.save();

      await ReportModel.deleteMany({ comment: report.comment });

      return;
    }
  }
}
