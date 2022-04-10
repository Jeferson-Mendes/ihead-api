import authConfig from '@core/config/auth';
import { AppError } from '@core/errors/AppError';
import { IUser } from '@core/ts/user';
import { JwtPayload, sign, verify } from 'jsonwebtoken';

export default class JWTService {
  sign(user: IUser): string {
    const userSerialized = {
      id: user.id,
      // is_adm: user.is_adm,
    };
    const token = sign({ ...userSerialized }, authConfig.jwt.secret, {
      // subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });
    return token;
  }

  verify(token: string): string | JwtPayload {
    try {
      return verify(token, process.env.APP_SECRET || 'secret_ihead-api');
    } catch (err) {
      throw new AppError('Token invalid', 401);
    }
  }
}
