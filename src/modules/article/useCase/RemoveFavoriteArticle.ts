import { AppError } from '@core/errors/AppError';
import ArticleModel, { Article } from '@modules/article/ArticleModel';
import UserModel from '../../user/UserModel';

interface IRequest {
  articleId: string;
  userId: string;
}

export default class RemoveFavoriteArticleService {
  public async execute({ articleId, userId }: IRequest): Promise<boolean> {
    const article = await ArticleModel.findById(articleId);

    if (!article) {
      throw new AppError('Artigo não encontrado');
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AppError('Usuário não encontrado');
    }

    const position = user.favoriteArticles.indexOf(
      articleId as unknown as Article,
    );
    user.favoriteArticles.splice(position, 1);
    await user.save();

    return true;
  }
}
