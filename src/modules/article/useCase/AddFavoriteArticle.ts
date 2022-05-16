import { AppError } from '@core/errors/AppError';
import ArticleModel, { Article } from '@modules/article/ArticleModel';
import UserModel from '../../user/UserModel';

interface IRequest {
  articleId: string;
  userId: string;
}

export default class AddFavoriteArticleService {
  public async execute({ articleId, userId }: IRequest): Promise<boolean> {
    const article = await ArticleModel.findById(articleId);

    if (!article) {
      throw new AppError('Artigo não encontrado');
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AppError('Usuário não encontrado');
    }

    const alreadyIsFavorite = user.favoriteArticles.includes(
      articleId as unknown as Article,
    );

    if (alreadyIsFavorite) {
      throw new AppError('Este artigo já está na sua lista de favoritos.');
    }

    user.favoriteArticles.push(article);
    await user.save();

    return true;
  }
}
