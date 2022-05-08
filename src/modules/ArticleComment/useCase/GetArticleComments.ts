import { AppError } from '@core/errors/AppError';
import { isValidObjectId } from 'mongoose';
import ArticleCommentModel, { ArticleComment } from '../ArticleCommentModel';

interface IRequest {
  articleId: string;
  limit?: number;
  page?: number;
}

export default class GetArticleCommentsService {
  public async execute({
    articleId,
    limit,
    page,
  }: IRequest): Promise<{ comments: ArticleComment[]; commentsQtd: number }> {
    const paramLimit = parseInt(String(limit)) || 10;
    const paramPage = parseInt(String(page)) || 1;
    const skip = paramLimit * (paramPage - 1);

    const isValidId = isValidObjectId(articleId);

    if (!isValidId) {
      throw new AppError('Id do artigo inválido');
    }

    const comments = await ArticleCommentModel.find({ article: articleId })
      .limit(paramLimit)
      .skip(skip)
      .populate({ path: 'user', populate: { path: 'resource' } })
      .sort({ createdAt: -1 });

    const commentsQtd = await ArticleCommentModel.find({
      article: articleId,
    }).count();

    return { comments, commentsQtd };
  }
}
