import ArticleModel, { Article } from '../ArticleModel';
import cloudinary from '@core/config/cloudinary';
import ResourceModel from '@modules/resource/ResourceModel';
import { AppError } from '@core/errors/AppError';
import UserModel from '@modules/user/UserModel';
import { CategoryArticleEnum } from '@core/ts/article';

interface IRequest {
  title: string;
  author: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file?: any;
  articleContent: string;
  category: CategoryArticleEnum;
  description: string;
  githubRepoLink?: string;
  references?: string[];
  articleId: string;
}

export default class UpdateArticleService {
  public async execute({
    title,
    author,
    file,
    articleContent,
    category,
    description,
    references,
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
      if (file && !article?.coverImage) {
        const uploadResult = await cloudinary.uploader.upload(
          file.path,
          (error: any) => {
            if (error) {
              throw new AppError('Fail to upload image');
            }
          },
        );

        const resource = await ResourceModel.create({
          cloudinary_id: uploadResult.public_id,
          secure_url: uploadResult.secure_url,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const articleData: Article | any = {
          title,
          articleContent,
          category,
          description,
          references: references || [],
          coverImage: resource.id,
        };

        const updatedArticle = await ArticleModel.findByIdAndUpdate(
          articleId,
          articleData,
          { new: true, runValidators: true },
        ).populate('coverImage');

        return updatedArticle;
      }

      if (file && article?.coverImage) {
        const resource = await ResourceModel.findById(
          article.coverImage,
        ).select('+cloudinary_id');

        if (resource) {
          // delete image from cloudinary
          await cloudinary.uploader.destroy(resource.cloudinary_id);

          // upload new image to cloudinary
          const uploadResult = await cloudinary.uploader.upload(file.path);

          // update resource document
          await ResourceModel.findByIdAndUpdate(resource.id, {
            cloudinary_id: uploadResult.public_id,
            secure_url: uploadResult.secure_url,
          });

          const articleData: Article | any = {
            title,
            articleContent,
            category,
            description,
            references: references || [],
          };

          const updatedArticle = await ArticleModel.findByIdAndUpdate(
            articleId,
            articleData,
            { new: true, runValidators: true },
          ).populate('coverImage');

          return updatedArticle;
        }
      }

      if (!file) {
        const articleData: Article | any = {
          title,
          articleContent,
          category,
          description,
          references: references || [],
        };

        const updatedArticle = await ArticleModel.findByIdAndUpdate(
          articleId,
          articleData,
          { new: true, runValidators: true },
        ).populate('coverImage');

        return updatedArticle;
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
