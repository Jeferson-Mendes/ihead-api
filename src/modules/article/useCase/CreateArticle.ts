import ArticleModel, { Article } from '../ArticleModel';
import cloudinary from '@core/config/cloudinary';
import ResourceModel from '@modules/resource/ResourceModel';
import { AppError } from '@core/errors/AppError';
import UserModel from '@modules/user/UserModel';
import { CategoryArticleEnum } from '@core/ts/article';
import { removeTags } from '@core/utils/RemoveTagsHtml';

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
}

export default class CreateArticleService {
  public async execute({
    title,
    author,
    file,
    articleContent,
    category,
    description,
    githubRepoLink,
    references,
  }: IRequest): Promise<Article> {
    const user = await UserModel.findById(author);
    if (!user) {
      throw new AppError('Usuário não encontrado');
    }

    const checkPublication = removeTags(articleContent);

    try {
      if (file) {
        const uploadResult = await cloudinary.uploader.upload(
          file.path,
          (error: unknown) => {
            if (error) {
              throw new AppError('Fail to upload image');
            }
          },
        );

        const resource = await ResourceModel.create({
          cloudinary_id: uploadResult.public_id,
          secure_url: uploadResult.secure_url,
        });

        const articleData = {
          title,
          articleContent,
          author: user.id,
          category,
          description,
          githubRepoLink,
          references,
          coverImage: resource.id,
        };

        const article = await ArticleModel.create(articleData);

        if (checkPublication.length >= 1000) {
          user.contributionTotalHours += 60; // 60 minutes
        }

        user.publicationsNumber += 1;
        await user.save();

        return article;
      } else {
        const articleData = {
          title,
          articleContent,
          author: user,
          category,
          description,
          githubRepoLink,
          references,
        };

        const article = await ArticleModel.create(articleData);

        if (checkPublication.length >= 1000) {
          user.contributionTotalHours += 60;
        }

        user.publicationsNumber += 1;
        await user.save();

        return article;
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
