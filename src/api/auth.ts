import { Role } from '@prisma/client';
import { Router } from 'express';
import { verifyAccessToken } from '../service/auth/jwt';
import { create, deleteUser, getUser, login } from '../service/user';

const authRouter = Router();

authRouter.post('/signup', create);

authRouter.post('/login', login);

// TODO: Change routes to /user
authRouter.get('/getUser', verifyAccessToken([Role.EDITOR]), getUser);
authRouter.delete('/deleteUser', verifyAccessToken([Role.EDITOR]), deleteUser);

export { authRouter };
