import { AppError } from '@core/errors/AppError';
import UserModel from '@modules/user/UserModel';
import ArticleCommentModel from '../ArticleCommentModel';
import ReportModel from '@modules/report/ReportModel';
import { UserRolesEnum } from '@core/ts/user';

interface IRequest {
  user: string;
  commentId: string;
}

export default class DeleteCommentService {
  public async execute({
    user,
    commentId,
  }: IRequest): Promise<{ deleted: boolean }> {
    const userExists = await UserModel.findById(user);
    if (!userExists) {
      throw new AppError('Usuário não encontrado');
    }

    const comment = await ArticleCommentModel.findById(commentId);

    if (!comment) {
      throw new AppError('Comentário não encontrado');
    }

    if (!comment.user) {
      throw new AppError('Usuário não encontrado no comentário');
    }

    if (
      comment.user.toString() !== userExists.id.toString() &&
      userExists.userRole !== UserRolesEnum.MODERATOR
    ) {
      throw new AppError('Sem permissão para excluir este artigo.');
    }

    const openReports = await ReportModel.find({ comment: commentId }).count();

    if (openReports > 0) {
      throw new AppError(
        'Ação indisponível. Este comentário possui denúncias.',
      );
    }

    userExists.contributionTotalHours -= 5;
    await userExists.save();

    try {
      await ArticleCommentModel.deleteOne({ _id: commentId });

      return { deleted: true };
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
