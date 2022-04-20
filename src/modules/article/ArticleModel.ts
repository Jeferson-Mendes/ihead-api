import { CategoryArticleEnum } from '@core/ts/article';
import { ArticleComment } from '@modules/ArticleComment/ArticleCommentModel';
import { Resource } from '@modules/resource/ResourceModel';
import { User } from '@modules/user/UserModel';
import { getModelForClass, prop, Ref } from '@typegoose/typegoose';

export class Article {
  @prop()
  public title!: string;

  @prop({ ref: () => User })
  public author: Ref<User>;

  @prop({ ref: () => Resource })
  public coverImage?: Ref<Resource>;

  @prop()
  public articleContent?: string;

  @prop({ type: String, enum: CategoryArticleEnum })
  public category: CategoryArticleEnum;

  @prop()
  public likes: number;

  @prop()
  public views: number;

  @prop()
  public description: number;

  @prop({ ref: () => ArticleComment })
  public comments: Ref<ArticleComment[]>;

  @prop()
  public githubRepoLink?: string;

  @prop()
  public reportsReceived: number;
}

const ArticleModel = getModelForClass(Article, {
  schemaOptions: {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
});

export default ArticleModel;
