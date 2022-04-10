import { IUser } from '@core/ts/user';
import { User } from '../UserModel';
import JWTService from './JwtFeatures';

interface IResponse {
  user: IUser;
  token: string;
}

export const tokenGenerate = (user: User): IResponse => {
  const jwtService = new JWTService();
  const token = jwtService.sign(user);
  return {
    user: user,
    token,
  };
};
