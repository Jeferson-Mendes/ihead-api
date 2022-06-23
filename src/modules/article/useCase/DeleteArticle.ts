import ArticleModel, { Article } from '../ArticleModel';
import cloudinary from '@core/config/cloudinary';
import ResourceModel from '@modules/resource/ResourceModel';
import { AppError } from '@core/errors/AppError';
import UserModel from '@modules/user/UserModel';

interface IRequest {
  author: string;
  articleId: string;
}

export default class DeleteArticleService {
  public async execute({
    author,
    articleId,
  }: IRequest): Promise<Article | null | undefined> {
    const user = await UserModel.findById(author);
    if (!user) {
      throw new AppError('Usuário não encontrado');
    }

    if (articleId === 'undefined') {
      throw new AppError('Falha ao atualizar artigo, tente novamente');
    }

    const article = await ArticleModel.findById(articleId);

    if (!article || article.author?.toString() !== user._id.toString()) {
      throw new AppError('Artigo não encontrado ou não pertende ao usuário');
    }

    try {
      if (article?.coverImage) {
        const resource = await ResourceModel.findById(
          article.coverImage,
        ).select('+cloudinary_id');

        if (resource) {
          // delete image from cloudinary
          await cloudinary.uploader.destroy(resource.cloudinary_id);

          // update resource document
          await ResourceModel.findByIdAndDelete(resource.id);

          const deletedArticle = await ArticleModel.findByIdAndDelete(
            articleId,
          );

          return deletedArticle;
        }
      } else {
        const deletedArticle = await ArticleModel.findByIdAndDelete(articleId);

        return deletedArticle;
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
