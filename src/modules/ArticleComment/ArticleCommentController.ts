import { Auth } from '@modules/auth/decorators/Auth';
import { Request, Response } from 'express';
import AddFavoriteCommentService from './useCase/AddFavoriteComment';
import CreateArticleCommentService from './useCase/CreateArticleComment';
import GetArticleCommentsService from './useCase/GetArticleComments';
import RemoveFavoriteCommentService from './useCase/RemoveFavoriteComment';

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

  @Auth
  public async addFavoriteComment(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { articleCommentId } = req.params;
    const { id } = req.user;

    const addFavoriteComment = new AddFavoriteCommentService();

    const isSuccess = await addFavoriteComment.execute({
      articleCommentId,
      userId: id,
    });

    return res.json({ isSuccess, status: 200 });
  }

  @Auth
  public async removeFavoriteComment(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { articleCommentId } = req.params;
    const { id } = req.user;

    const removeFavoriteComment = new RemoveFavoriteCommentService();

    const isSuccess = await removeFavoriteComment.execute({
      articleCommentId,
      userId: id,
    });

    return res.json({ isSuccess, status: 200 });
  }
}
