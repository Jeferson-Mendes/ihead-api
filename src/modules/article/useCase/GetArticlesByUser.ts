import ArticleModel, { Article } from '../ArticleModel';
import { isValidObjectId } from 'mongoose';
import { AppError } from '@core/errors/AppError';
import UserModel from '@modules/user/UserModel';

interface IRequest {
  limit?: number;
  page?: number;
  userId: string;
}

export default class GetArticlesByUserService {
  public async execute({
    userId,
    limit,
    page,
  }: IRequest): Promise<{ article: Article; isFavorite: boolean }[]> {
    const paramLimit = parseInt(String(limit)) || 10;
    const paramPage = parseInt(String(page)) || 1;
    const skip = paramLimit * (paramPage - 1);

    const isValidId = isValidObjectId(userId);

    if (!isValidId) {
      throw new AppError('Id de usuário inválido');
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AppError('Usuário não encontrado.');
    }

    const articles = await ArticleModel.find({ author: userId })
      .limit(paramLimit)
      .skip(skip)
      .populate('coverImage')
      .populate('author');

    const serializedArticles = articles.map(article => {
      const isFavorite = user.favoriteArticles.includes(article.id);
      if (isFavorite) {
        // const data = Object.assign(article, { isFavorite: true });
        // console.log(data);
        return { article, isFavorite: true };
      }

      return { article, isFavorite: false };
    });

    return serializedArticles;
  }
}
