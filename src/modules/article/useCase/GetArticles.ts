import ArticleModel, { Article } from '../ArticleModel';

interface IRequest {
  limit?: number;
  page?: number;
  keyword?: string;
}

export default class GetArticlesService {
  public async execute({ keyword, limit, page }: IRequest): Promise<Article[]> {
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
    };

    const articles = await ArticleModel.find({
      ...params.keyword,
    })
      .limit(paramLimit)
      .skip(skip)
      .populate('coverImage')
      .populate('author');

    return articles;
  }
}
