import { Role } from '@prisma/client';
import { Router } from 'express';
import { verifyAccessToken } from '../../../service/auth/jwt';
import {
    createSkill,
    deleteSkill,
    getAllSkills,
    getSkill,
    updateSkill,
} from '../../../service/editor/skill';

const skillRouter = Router();

skillRouter
    .route('/skills')
    .get(verifyAccessToken([Role.EDITOR]), getAllSkills)
    .post(verifyAccessToken([Role.EDITOR]), createSkill);

skillRouter
    .route('/skills/:skillId')
    .get(verifyAccessToken([Role.EDITOR]), getSkill)
    .put(verifyAccessToken([Role.EDITOR]), updateSkill)
    .delete(verifyAccessToken([Role.EDITOR]), deleteSkill);

export { skillRouter };
