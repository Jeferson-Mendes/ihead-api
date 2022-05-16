import { UserRolesEnum } from '@core/ts/user';
import { Article } from '@modules/article/ArticleModel';
import { ArticleComment } from '@modules/ArticleComment/ArticleCommentModel';
// import { Article } from '@modules/article/ArticleModel';
import { Resource } from '@modules/resource/ResourceModel';
import { getModelForClass, pre, prop, Ref } from '@typegoose/typegoose';
import BcryptService from './utils/BcryptFeatures';

const bcryptService = new BcryptService();
@pre<User>('save', async function () {
  if (this.isModified('password')) {
    this.email = this.email.toLowerCase().trim();
    this.password = bcryptService.generateHash(this.password);
  }
})
export class User {
  @prop()
  public name!: string;

  @prop({ unique: true })
  public email: string;

  @prop()
  public password: string;

  @prop()
  public socialName?: string;

  @prop()
  public genderIdentity?: string;

  @prop()
  public phoneNumber: string;

  // @prop({ ref: () => Article })
  // public articles: Ref<Article[]>;

  @prop()
  public picture?: string;

  @prop({ ref: 'Resource' })
  public resource?: Ref<Resource>;

  @prop({ select: false })
  public googleId?: string;

  @prop()
  public githubLink?: string;

  @prop()
  public linkedinLink?: string;

  @prop()
  public semester: number;

  @prop()
  public enroll_number?: string;

  @prop({
    required: true,
    type: String,
    default: UserRolesEnum.USER,
    enum: UserRolesEnum,
  })
  public userRole: UserRolesEnum;

  @prop({ default: 0 })
  public publicationsNumber: number;

  @prop({ default: 0 })
  public commentsNumber: number;

  @prop({ default: 0 })
  public reportsReceived: number;

  @prop({ default: 0 })
  public contributionTotalHours: number;

  @prop({ type: Object, ref: 'Article' })
  public favoriteArticles: Article[];

  @prop({ type: Object, ref: 'ArticleComment' })
  public favoriteArticleComments: ArticleComment[];
}

const UserModel = getModelForClass(User, {
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

export default UserModel;
