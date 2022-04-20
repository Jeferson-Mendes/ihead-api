import { AppError } from '@core/errors/AppError';
import { Request, Response } from 'express';
import GoogleLoginService from '../../core/services/GoogleLogin';
import UserModel from './UserModel';
import BcryptService from './utils/BcryptFeatures';
import { tokenGenerate } from './utils/tokenGenerate';

export default class UserAuthController {
  public async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const userExists = await UserModel.findOne({ email });

    const bcryptService = new BcryptService();
    if (
      !userExists ||
      !bcryptService.compareHash(password, userExists.password)
    ) {
      throw new AppError('Usuário não encontrado ou senha incorreta.', 400);
    }

    const authUser = tokenGenerate(userExists);

    return res.json({ ...authUser, status: 200 });
  }

  public async googleAuth(req: Request, res: Response): Promise<Response> {
    const googleLoginService = new GoogleLoginService();

    const userGoogle = await googleLoginService.execute(req.body.tokenId);

    if (userGoogle) {
      const userAlreadyExists = await UserModel.findOne({
        googleId: userGoogle?.sub,
      });

      if (userAlreadyExists) {
        const authUser = tokenGenerate(userAlreadyExists);
        return res.json({ ...authUser, status: 200 });
      }

      const userData = {
        name: userGoogle.name,
        email: userGoogle.email,
        picture: userGoogle.picture,
        googleId: userGoogle.sub,
      };

      const createdUser = await UserModel.create(userData);
      createdUser.googleId = undefined;
      const authUser = tokenGenerate(createdUser);
      return res.json({ ...authUser, status: 200 });
    }

    return res.status(400).json({ message: 'Fail when login with google' });
  }
}
