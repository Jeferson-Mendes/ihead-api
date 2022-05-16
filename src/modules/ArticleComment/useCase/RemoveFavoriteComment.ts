import { AppError } from '@core/errors/AppError';
import ArticleCommentModel, {
  ArticleComment,
} from '@modules/ArticleComment/ArticleCommentModel';
import UserModel from '../../user/UserModel';

interface IRequest {
  articleCommentId: string;
  userId: string;
}

export default class RemoveFavoriteCommentService {
  public async execute({
    articleCommentId,
    userId,
  }: IRequest): Promise<boolean> {
    const articleComment = await ArticleCommentModel.findById(articleCommentId);

    if (!articleComment) {
      throw new AppError('Comentário não encontrado');
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AppError('Usuário não encontrado');
    }

    const position = user.favoriteArticleComments.indexOf(
      articleCommentId as unknown as ArticleComment,
    );
    user.favoriteArticleComments.splice(position, 1);
    await user.save();

    return true;
  }
}
