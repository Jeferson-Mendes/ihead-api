import { Article } from '@modules/article/ArticleModel';
import { User } from '@modules/user/UserModel';
import { getModelForClass, prop, Ref } from '@typegoose/typegoose';

export class ArticleComment {
  @prop({ ref: 'User' })
  public user: Ref<User>;

  @prop({ ref: 'Article' })
  public article: Ref<Article>;

  @prop()
  public commentContent: string;

  @prop()
  public numberLikes: number;

  @prop()
  public reportsReceived: number;
}

const ArticleCommentModel = getModelForClass(ArticleComment, {
  schemaOptions: {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
      },
    },
  },
});

export default ArticleCommentModel;
