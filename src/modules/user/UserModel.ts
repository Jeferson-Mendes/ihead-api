import { getModelForClass, pre, prop } from '@typegoose/typegoose';
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

  @prop()
  public email: string;

  @prop()
  public password: string;
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
