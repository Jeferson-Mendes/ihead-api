import ArticleModel, { Article } from '../ArticleModel';
import { isValidObjectId } from 'mongoose';
import { AppError } from '@core/errors/AppError';

interface IRequest {
  limit?: number;
  page?: number;
  userId: string;
}

export default class GetArticlesByUserService {
  public async execute({ userId, limit, page }: IRequest): Promise<Article[]> {
    const paramLimit = parseInt(String(limit)) || 10;
    const paramPage = parseInt(String(page)) || 1;
    const skip = paramLimit * (paramPage - 1);

    const isValidId = isValidObjectId(userId);

    if (!isValidId) {
      throw new AppError('Id de usuário inválido');
    }

    const articles = await ArticleModel.find({ author: userId })
      .limit(paramLimit)
      .skip(skip)
      .populate('coverImage')
      .populate('author');

    return articles;
  }
}
