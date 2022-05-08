import { Auth } from '@modules/auth/decorators/Auth';
import { Request, Response } from 'express';
import CreateArticleCommentService from './useCase/CreateArticleComment';
import GetArticleCommentsService from './useCase/GetArticleComments';

export default class ArticleCommentController {
  @Auth
  public async create(request: Request, response: Response): Promise<Response> {
    const { article, comment } = request.body;
    const { id } = request.user;

    const createArticleCommentService = new CreateArticleCommentService();

    const createdComment = await createArticleCommentService.execute({
      user: id,
      article,
      commentContent: comment,
    });

    return response.json({ comment: createdComment, status: 200 });
  }

  @Auth
  public async getByArticle(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { articleId } = request.params;
    const { limit, page } = request.query;

    const getArticleCommentsService = new GetArticleCommentsService();

    const { comments, commentsQtd } = await getArticleCommentsService.execute({
      articleId: articleId,
      limit: Number(limit),
      page: Number(page),
    });

    return response.json({ comments, quantity: commentsQtd, status: 200 });
  }
}
