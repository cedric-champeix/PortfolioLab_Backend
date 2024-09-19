import { Role } from '@prisma/client';
import { Router } from 'express';
import { verifyAccessToken } from '../../../service/auth/jwt';
import {
    createLanguage,
    deleteLanguage,
    getAllLanguages,
    getLanguage,
    updateLanguage,
} from '../../../service/editor/resume/language';

const languageRouter = Router();

languageRouter
    .route('/languages')
    .get(verifyAccessToken([Role.EDITOR]), getAllLanguages)
    .post(verifyAccessToken([Role.EDITOR]), createLanguage);

languageRouter
    .route('/languages/:languageId')
    .get(verifyAccessToken([Role.EDITOR]), getLanguage)
    .put(verifyAccessToken([Role.EDITOR]), updateLanguage)
    .delete(verifyAccessToken([Role.EDITOR]), deleteLanguage);

export { languageRouter };
