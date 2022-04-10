import UserModel, { User } from '../UserModel';

export default class ListUserService {
  public async execute(): Promise<User[]> {
    try {
      const users = await UserModel.find();
      return users;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
