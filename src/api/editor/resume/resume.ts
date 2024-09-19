import { Role } from '@prisma/client';
import { Router } from 'express';
import {
    connectImage,
    connectSkill,
    connectSocial,
    disconnectImage,
    disconnectSkill,
    disconnectSocial,
    getFullResume,
    getResume,
    publish,
    resetResume,
    unpublish,
    updateResume,
} from '../../../service/editor/resume/resume';

import { verifyAccessToken } from '../../../service/auth/jwt';

const resumeRouter = Router();

resumeRouter
    .route('/resume')
    .get(verifyAccessToken([Role.EDITOR]), getResume)
    .put(verifyAccessToken([Role.EDITOR]), updateResume)
    .delete(verifyAccessToken([Role.EDITOR]), resetResume);

resumeRouter
    .route('/resume/preview')
    .get(verifyAccessToken([Role.EDITOR]), getFullResume);

resumeRouter
    .route('/resume/image/:imageId')
    .put(verifyAccessToken([Role.EDITOR]), connectImage);

resumeRouter
    .route('/resume/image')
    .delete(verifyAccessToken([Role.EDITOR]), disconnectImage);

resumeRouter
    .route('/resume/skills/:skillId')
    .put(verifyAccessToken([Role.EDITOR]), connectSkill)
    .delete(verifyAccessToken([Role.EDITOR]), disconnectSkill);

resumeRouter
    .route('/resume/socials/:contactId')
    .put(verifyAccessToken([Role.EDITOR]), connectSocial)
    .delete(verifyAccessToken([Role.EDITOR]), disconnectSocial);

resumeRouter
    .route('/resume/publish')
    .put(verifyAccessToken([Role.EDITOR]), publish);

resumeRouter
    .route('/resume/unpublish')
    .put(verifyAccessToken([Role.EDITOR]), unpublish);

export { resumeRouter };
