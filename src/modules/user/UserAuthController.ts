import { AppError } from '@core/errors/AppError';
import { Request, Response } from 'express';
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
}
