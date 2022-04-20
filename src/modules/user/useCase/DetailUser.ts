import { AppError } from '@core/errors/AppError';
import UserModel, { User } from '../UserModel';

export default class DetailUserService {
  public async execute(id: string): Promise<User> {
    try {
      const user = await UserModel.findById(id).populate('resource');

      if (!user) {
        throw new AppError('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
