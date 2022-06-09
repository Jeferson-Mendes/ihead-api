import UserModel from '../UserModel';
import { User } from '../UserModel';
import BcryptService from '../utils/BcryptFeatures';
import { AppError } from '@core/errors/AppError';

interface IRequest {
  currentPassword: string;
  newPassword: string;
  user_id: string;
}

class UpdateUserPassword {
  public async execute({
    currentPassword,
    newPassword,
    user_id,
  }: IRequest): Promise<User> {
    const bcryptService = new BcryptService();

    const userExists = await UserModel.findById(user_id);

    if (!userExists) {
      throw new AppError('Usuário não encontrado', 404);
    }

    const confirmPassword = bcryptService.compareHash(
      currentPassword,
      userExists.password,
    );

    if (!confirmPassword) {
      throw new AppError('Senha atual está incorreta.');
    }

    const passwordHash = bcryptService.generateHash(newPassword);

    await UserModel.updateOne({ _id: user_id }, { password: passwordHash });

    return userExists;
  }
}

export default UpdateUserPassword;
