import { AppError } from '@core/errors/AppError';
import UserModel from '@modules/user/UserModel';
import { isValidObjectId } from 'mongoose';
import ArticleModel, { Article } from '../ArticleModel';

export default class DetailArticleService {
  public async execute(
    id: string,
    userId: string,
  ): Promise<{ article: Article; isFavorite: boolean }> {
    const isValidId = isValidObjectId(id);

    if (!isValidId) {
      throw new AppError('ID inválido');
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AppError('Usuário não encontrado.');
    }

    const article = await ArticleModel.findById(id)
      .populate('coverImage')
      .populate({ path: 'author', populate: { path: 'resource' } });
    // const articleContent = article.articleContent.replace(/\\n/g, '\n');
    // article.articleContent = undefined;

    if (!article) {
      throw new AppError('Artigo não encontrado');
    }

    await article.updateOne({
      $inc: { views: 1 },
    });

    const isFavorite = user.favoriteArticles.includes(article._id);

    if (article.references.length > 1 || !article.references.length) {
      return { article, isFavorite };
    }

    const parseArticleRef = JSON.parse(String(article.references));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentArticle = article as any;
    const serializedArticle = {
      ...currentArticle._doc,
      references: parseArticleRef,
    };

    return { article: serializedArticle, isFavorite };
  }
}
