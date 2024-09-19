import { Role, User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserIDJwtPayload } from '../../@types/userIDJwtPayload';
import { exclude } from '../../utils/exclude';
import { prisma } from '../client';

const verifyAccessToken =
    (requiredRole: Role[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jwt_token = req.cookies.jwt_token;

            if (!jwt_token)
                return res.status(401).json({ message: 'No token provided.' });

            const decoded = <UserIDJwtPayload>(
                jwt.verify(jwt_token, process.env.JWT_SECRET_KEY ?? '')
            );

            const { id } = decoded;
            const user = await prisma.user.findUnique({
                where: {
                    id: id,
                },
            });

            if (!user)
                return res.status(500).json({ message: "Couldn't find user." });

            if (!requiredRole.includes(user.role))
                return res.status(403).json({
                    message:
                        'You do not have the authorization and permissions to access this resource.',
                });

            req.user = <User>exclude(user, ['pwd']);
            next();
        } catch (e) {
            console.log('Error when verifying access token: ', e);
            return res
                .status(401)
                .json({ message: 'This session has expired. Please login.' });
        }
    };

const generateAccessToken = (user: User) => {
    const payload = {
        id: user.id,
        role: user.role,
    };

    const secret = process.env.JWT_SECRET_KEY ?? '';
    const options = { expiresIn: '24h' };

    return jwt.sign(payload, secret, options);
};

export { generateAccessToken, verifyAccessToken };
