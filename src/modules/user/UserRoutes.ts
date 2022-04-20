import { Router } from 'express';
import UserAuthController from './UserAuthController';
import UserController from './UserController';
import uploadConfig from '@core/config/multer';
import {
  createUserValidator,
  loginValidator,
  updateUserValidator,
} from './UserValidators';

const UserRoutes = Router();

const userController = new UserController();
const userAuthController = new UserAuthController();

UserRoutes.get('/', userController.list);
UserRoutes.get('/:id', userController.detail);
UserRoutes.post('/create', createUserValidator, userController.create);
UserRoutes.post('/login', loginValidator, userAuthController.login);
UserRoutes.post('/google-auth', userAuthController.googleAuth);

UserRoutes.put(
  '/update',
  uploadConfig.single('file'),
  updateUserValidator,
  userController.update,
);

export default UserRoutes;
