import 'reflect-metadata';

// import { AccessLevel } from '../../users/model/UserModel';
import { AppError } from '@core/errors/AppError';
import UserModel from '@modules/user/UserModel';
import { UserRolesEnum } from '@core/ts/user';

export function IsModerator(
  target: unknown,
  propertyName: string,
  propertyDescriptor: PropertyDescriptor,
): void {
  const method = propertyDescriptor.value;

  propertyDescriptor.value = async function (...args: any[]) {
    const user = args[0].user;

    if (!user) {
      throw new AppError('Usuário não foi encontrado', 404);
    }

    const userExists = await UserModel.findById(user.id);

    if (userExists?.userRole !== UserRolesEnum.MODERATOR) {
      throw new AppError(
        'Usuário não tem permissão para acessar esse recurso',
        403,
      );
    }

    return method.apply(this, args);
  };
}
