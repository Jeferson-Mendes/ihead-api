import UserModel, { User } from '../UserModel';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

export default class CreateUserService {
  public async execute({ name, email, password }: IRequest): Promise<User> {
    try {
      const user = await UserModel.create({ name, email, password });
      return user;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
