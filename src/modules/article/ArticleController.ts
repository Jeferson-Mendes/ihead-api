import { Request, Response } from 'express';
import { Auth } from '@modules/auth/decorators/Auth';
import CreateArticleService from './useCase/CreateArticle';
import GetArticlesService from './useCase/GetArticles';
import GetArticlesByUserService from './useCase/GetArticlesByUser';
import DetailArticleService from './useCase/DetailArticle';
import AddFavoriteArticleService from './useCase/AddFavoriteArticle';
import RemoveFavoriteArticleService from './useCase/RemoveFavoriteArticle';
import { CategoryArticleEnum } from '@core/ts/article';

export default class ArticleController {
  @Auth
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      title,
      articleContent,
      category,
      description,
      githubRepoLink,
      references,
    } = request.body;

    const { id } = request.user;
    const createArticleService = new CreateArticleService();

    const article = await createArticleService.execute({
      title,
      articleContent,
      author: id,
      category,
      description,
      githubRepoLink,
      references,
      file: request.file,
    });

    return response.json({ article, status: 200 });
  }

  @Auth
  public async list(request: Request, response: Response): Promise<Response> {
    const { limit, page, keyword, categories } = request.query;
    const { id } = request.user;

    const getArticlesService = new GetArticlesService();

    const serializedCategories = categories
      ? (String(categories)
          .trim()
          .replace(/ /g, '')
          .split(',') as unknown as CategoryArticleEnum[])
      : undefined;

    const articles = await getArticlesService.execute({
      keyword: keyword ? String(keyword) : undefined,
      limit: Number(limit),
      page: Number(page),
      categories: serializedCategories,
      userId: id,
    });

    return response.json({
      articles: articles.serializedArticles,
      status: 200,
      resultsNumber: articles.resultsNumber,
    });
  }

  @Auth
  public async getArticlesByUser(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { limit, page } = request.query;
    const { userId } = request.params;

    const getArticlesByUserService = new GetArticlesByUserService();

    const articles = await getArticlesByUserService.execute({
      userId,
      limit: Number(limit),
      page: Number(page),
    });

    return response.json({ articles, status: 200 });
  }

  @Auth
  public async detail(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const detailArticleService = new DetailArticleService();

    const article = await detailArticleService.execute(id);

    return response.json({ article, status: 200 });
  }

  @Auth
  public async addFavoriteArticle(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { articleId } = req.params;
    const { id } = req.user;

    const addFavoriteArticleService = new AddFavoriteArticleService();

    const isSuccess = await addFavoriteArticleService.execute({
      articleId,
      userId: id,
    });

    return res.json({ isSuccess, status: 200 });
  }

  @Auth
  public async removeFavoriteArticle(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { articleId } = req.params;
    const { id } = req.user;

    const rmoveFavoriteArticleService = new RemoveFavoriteArticleService();

    const isSuccess = await rmoveFavoriteArticleService.execute({
      articleId,
      userId: id,
    });

    return res.json({ isSuccess, status: 200 });
  }
}
