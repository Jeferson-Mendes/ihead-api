import { AppError } from '@core/errors/AppError';
import ArticleCommentModel, {
  ArticleComment,
} from '@modules/ArticleComment/ArticleCommentModel';
import UserModel from '../../user/UserModel';

interface IRequest {
  articleCommentId: string;
  userId: string;
}

export default class AddFavoriteCommentService {
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

    const alreadyIsFavorite = user.favoriteArticleComments.includes(
      articleCommentId as unknown as ArticleComment,
    );

    if (alreadyIsFavorite) {
      throw new AppError('Este comentário já está na sua lista de favoritos.');
    }

    user.favoriteArticleComments.push(articleComment);
    await user.save();

    return true;
  }
}
