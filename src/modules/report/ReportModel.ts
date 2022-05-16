import { Article } from '@modules/article/ArticleModel';
import { ArticleComment } from '@modules/ArticleComment/ArticleCommentModel';
import { User } from '@modules/user/UserModel';
import { getModelForClass, prop, Ref } from '@typegoose/typegoose';

export enum ReportTypeEnum {
  ARTICLE = 'Article',
  COMMENT = 'Comment',
}

export class Report {
  @prop({ ref: 'User' })
  public denounced: Ref<User>;

  @prop({ type: String, enum: ReportTypeEnum })
  public type: ReportTypeEnum;

  @prop({ ref: 'Article' })
  public publication?: Ref<Article>;

  @prop({ ref: 'ArticleComment' })
  public comment?: Ref<ArticleComment>;
}

const ReportModel = getModelForClass(Report, {
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

export default ReportModel;
