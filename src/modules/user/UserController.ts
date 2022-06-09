import { Auth } from '@modules/auth/decorators/Auth';
import { Request, Response } from 'express';
import CreateUserService from './useCase/CreateUser';
import DetailUserService from './useCase/DetailUser';
import ListUserService from './useCase/ListUser';
import UpdateUserService from './useCase/UpdateUser';
import UpdateUserPassword from './useCase/UpdateUserPassword';

export default class UserController {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      name,
      email,
      password,
      socialName,
      phoneNumber,
      genderIdentity,
      semester,
    } = req.body;

    const createUserService = new CreateUserService();

    const user = await createUserService.execute({
      name,
      email,
      password,
      socialName,
      phoneNumber,
      genderIdentity,
      semester,
    });

    return res.json({ user, status: 200 });
  }

  @Auth
  public async list(req: Request, res: Response): Promise<Response> {
    const listUsers = new ListUserService();

    const users = await listUsers.execute();

    return res.json({ users, status: 200 });
  }

  @Auth
  public async detail(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const detailUser = new DetailUserService();

    const user = await detailUser.execute(id);

    return res.json({ user, status: 200 });
  }

  @Auth
  public async update(req: Request, res: Response): Promise<Response> {
    const { name, email, socialName, genderIdentity, phoneNumber, semester } =
      req.body;
    const { id } = req.user;

    const updateUserService = new UpdateUserService();

    const user = await updateUserService.execute({
      userId: id,
      name,
      email,
      socialName,
      genderIdentity,
      phoneNumber,
      semester,
      file: req.file,
    });

    return res.json({ user, status: 200 });
  }

  @Auth
  public async changePassword(req: Request, res: Response): Promise<Response> {
    const { currentPassword, newPassword } = req.body;
    const { id } = req.user;

    const updateUserPassword = new UpdateUserPassword();

    const user = await updateUserPassword.execute({
      currentPassword,
      newPassword,
      user_id: id,
    });

    return res.json({ user, status: 200 });
  }
}
