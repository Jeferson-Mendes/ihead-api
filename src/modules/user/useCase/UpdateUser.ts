import cloudinary from '@core/config/cloudinary';
import { AppError } from '@core/errors/AppError';
import ResourceModel from '@modules/resource/ResourceModel';
import UserModel, { User } from '../UserModel';

interface IRequest {
  userId: string;
  name?: string;
  email?: string;
  socialName?: string;
  genderIdentity?: string;
  phoneNumber?: string;
  semester?: number;
  file?: any;
}

export default class UpdateUserService {
  public async execute({
    userId,
    name,
    email,
    socialName,
    genderIdentity,
    phoneNumber,
    semester,
    file,
  }: IRequest): Promise<User | undefined | null> {
    const userExists = await UserModel.findById(userId);

    if (!userExists) {
      throw new AppError('User not found');
    }

    if (email) {
      const UserEmailAlreadyExists = await UserModel.findOne({ email });

      if (
        UserEmailAlreadyExists &&
        UserEmailAlreadyExists.email !== userExists.email
      ) {
        throw new AppError('Email already registered', 401);
      }
    }

    try {
      if (file && !userExists.resource) {
        const uploadResult = await cloudinary.uploader.upload(
          file.path,
          (error: any) => {
            if (error) {
              throw new AppError('Fail to upload image');
            }
          },
        );

        const resource = await ResourceModel.create({
          cloudinary_id: uploadResult.public_id,
          secure_url: uploadResult.secure_url,
        });

        const userData = {
          name,
          email,
          socialName,
          genderIdentity,
          phoneNumber,
          semester,
          resource: resource.id,
        };

        const updatedUser = await UserModel.findByIdAndUpdate(
          userId,
          userData,
          { new: true, runValidators: true },
        );

        return updatedUser;
      }

      if (file && userExists.resource) {
        const resource = await ResourceModel.findById(
          userExists.resource,
        ).select('+cloudinary_id');

        if (resource) {
          // delete image from cloudinary
          await cloudinary.uploader.destroy(resource.cloudinary_id);

          // upload new image to cloudinary
          const uploadResult = await cloudinary.uploader.upload(file.path);

          // update resource document
          await ResourceModel.findByIdAndUpdate(resource.id, {
            cloudinary_id: uploadResult.public_id,
            secure_url: uploadResult.secure_url,
          });

          const userData = {
            name,
            email,
            socialName,
            genderIdentity,
            phoneNumber,
            semester,
          };

          const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            userData,
            { new: true, runValidators: true },
          );

          return updatedUser;
        }
      }

      if (!file) {
        const userData = {
          name,
          email,
          socialName,
          genderIdentity,
          phoneNumber,
          semester,
        };

        const updatedUser = await UserModel.findByIdAndUpdate(
          userId,
          userData,
          { new: true, runValidators: true },
        );

        return updatedUser;
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
