import UserModel, { User } from '../UserModel';

interface IRequest {
  name: string;
  email: string;
  password: string;
  socialName?: string;
  genderIdentity?: string;
  phoneNumber: string;
  semester: number;
}

export default class CreateUserService {
  public async execute({
    name,
    email,
    password,
    socialName,
    genderIdentity,
    phoneNumber,
    semester,
  }: IRequest): Promise<User> {
    try {
      const user = await UserModel.create({
        name,
        email,
        password,
        socialName,
        genderIdentity,
        phoneNumber,
        semester,
      });
      return user;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
