import { AppError } from '@core/errors/AppError';
import UserModel, { User } from '../UserModel';

interface IRequest {
  name: string;
  email: string;
  password: string;
  socialName?: string;
  genderIdentity?: string;
  phoneNumber: string;
  semester: number;
}

export default class CreateUserService {
  public async execute({
    name,
    email,
    password,
    socialName,
    genderIdentity,
    phoneNumber,
    semester,
  }: IRequest): Promise<User> {
    const formattedEmail = email.toLowerCase().trim();
    const emailExists = await UserModel.findOne({ email: formattedEmail });

    if (emailExists) {
      throw new AppError('Email já está send utilizado');
    }

    try {
      const user = await UserModel.create({
        name,
        email,
        password,
        socialName,
        genderIdentity,
        phoneNumber,
        semester,
      });
      return user;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
