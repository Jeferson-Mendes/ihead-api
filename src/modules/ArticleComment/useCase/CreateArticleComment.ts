import { AppError } from '@core/errors/AppError';
import ArticleModel from '@modules/article/ArticleModel';
import UserModel from '@modules/user/UserModel';
import ArticleCommentModel, { ArticleComment } from '../ArticleCommentModel';

interface IRequest {
  user: string;
  article: string;
  commentContent: string;
}

export default class CreateArticleCommentService {
  public async execute({
    user,
    article,
    commentContent,
  }: IRequest): Promise<ArticleComment> {
    const userExists = await UserModel.findById(user);
    if (!userExists) {
      throw new AppError('Usuário não encontrado');
    }

    const articleExists = await ArticleModel.findById(article);

    if (!articleExists) {
      throw new AppError('Artigo não encontrado');
    }

    try {
      const articleComment = await ArticleCommentModel.create({
        user,
        article,
        commentContent,
      });

      userExists.commentsNumber += 1;
      await userExists.save();

      articleComment.user = undefined;

      const commentResponseData = Object.assign(articleComment, {
        user: userExists,
      });
      return commentResponseData;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
