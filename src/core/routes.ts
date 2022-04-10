import UserRoutes from '@modules/user/UserRoutes';
import { Router } from 'express';

const routes = Router();

routes.use('/users', UserRoutes);

export default routes;
