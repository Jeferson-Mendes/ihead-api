import { AppError } from '@core/errors/AppError';
import { isValidObjectId } from 'mongoose';
import ArticleModel, { Article } from '../ArticleModel';

export default class DetailArticleService {
  public async execute(id: string): Promise<Article> {
    const isValidId = isValidObjectId(id);

    if (!isValidId) {
      throw new AppError('ID inválido');
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

    return article;
  }
}
