import { Router } from 'express';
import UserAuthController from './UserAuthController';
import UserController from './UserController';

const UserRoutes = Router();

const userController = new UserController();
const userAuthController = new UserAuthController();

UserRoutes.get('/', userController.list);
UserRoutes.post('/create', userController.create);
UserRoutes.post('/login', userAuthController.login);

export default UserRoutes;
