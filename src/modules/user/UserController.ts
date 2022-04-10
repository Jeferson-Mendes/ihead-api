import { Auth } from '@modules/auth/decorators/Auth';
import { Request, Response } from 'express';
import CreateUserService from './useCase/CreateUser';
import ListUserService from './useCase/ListUser';

export default class UserController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const createUserService = new CreateUserService();

    const user = await createUserService.execute({ name, email, password });

    return res.json({ user, status: 200 });
  }

  @Auth
  public async list(req: Request, res: Response): Promise<Response> {
    const listUsers = new ListUserService();

    const users = await listUsers.execute();

    return res.json({ users, status: 200 });
  }
}
