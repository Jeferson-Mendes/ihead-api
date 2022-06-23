import { AppError } from '@core/errors/AppError';
import { CategoryArticleEnum } from '@core/ts/article';
import UserModel from '@modules/user/UserModel';
import ArticleModel, { Article } from '../ArticleModel';

interface IRequest {
  limit?: number;
  page?: number;
  keyword?: string;
  categories?: CategoryArticleEnum[];
  userId: string;
}

interface ISerializedArticle {
  article: Article;
  isFavorite: boolean;
}

interface IResponse {
  serializedArticles: ISerializedArticle[];
  resultsNumber: number;
}

export default class GetArticlesService {
  public async execute({
    keyword,
    limit,
    page,
    categories,
    userId,
  }: IRequest): Promise<IResponse> {
    const paramLimit = parseInt(String(limit)) || 10;
    const paramPage = parseInt(String(page)) || 1;
    const skip = paramLimit * (paramPage - 1);

    const params = {
      keyword: keyword
        ? {
            title: {
              $regex: keyword,
              $options: 'i',
            },
          }
        : {},
      categories: categories ? { category: { $in: categories } } : {},
    };

    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AppError('Usuário não encontrado.');
    }

    const articles = await ArticleModel.find({
      ...params.keyword,
      ...params.categories,
    })
      .limit(paramLimit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate('coverImage')
      .populate('author');

    const resultsNumber = await ArticleModel.find({
      ...params.keyword,
      ...params.categories,
    }).count();

    const serializedArticles = articles.map(article => {
      const isFavorite = user.favoriteArticles.includes(article.id);
      if (isFavorite) {
        // const data = Object.assign(article, { isFavorite: true });
        // console.log(data);
        return { article, isFavorite: true };
      }

      return { article, isFavorite: false };
    });

    return { serializedArticles, resultsNumber };
  }
}
