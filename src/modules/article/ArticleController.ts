import { Request, Response } from 'express';
import { Auth } from '@modules/auth/decorators/Auth';
import CreateArticleService from './useCase/CreateArticle';
import GetArticlesService from './useCase/GetArticles';
import GetArticlesByUserService from './useCase/GetArticlesByUser';
import DetailArticleService from './useCase/DetailArticle';

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
    const { limit, page, keyword } = request.query;

    const getArticlesService = new GetArticlesService();

    const articles = await getArticlesService.execute({
      keyword: keyword ? String(keyword) : undefined,
      limit: Number(limit),
      page: Number(page),
    });

    return response.json({ articles, status: 200 });
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
}
