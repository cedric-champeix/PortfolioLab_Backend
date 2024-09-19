import { Role } from '@prisma/client';
import { Router } from 'express';
import { verifyAccessToken } from '../../../service/auth/jwt';
import {
    connectMainImage,
    connectProjectImage,
    connectSkill,
    createProject,
    deleteProject,
    disconnectMainImage,
    disconnectProjectImage,
    disconnectSkill,
    getAllProjects,
    getProject,
    publish,
    unpublish,
    updateProject,
    updateProjectVisibility,
} from '../../../service/editor/project/project';

const projectRouter = Router();

projectRouter
    .route('/projects')
    .get(verifyAccessToken([Role.EDITOR]), getAllProjects)
    .post(verifyAccessToken([Role.EDITOR]), createProject);

projectRouter
    .route('/projects/:myProjectId')
    .get(verifyAccessToken([Role.EDITOR]), getProject)
    .put(verifyAccessToken([Role.EDITOR]), updateProject)
    .delete(verifyAccessToken([Role.EDITOR]), deleteProject);

projectRouter
    .route('/projects/:myProjectId/visibility')
    .put(verifyAccessToken([Role.EDITOR]), updateProjectVisibility);

projectRouter
    .route('/projects/:myProjectId/skills/:skillId')
    .put(verifyAccessToken([Role.EDITOR]), connectSkill)
    .delete(verifyAccessToken([Role.EDITOR]), disconnectSkill);

projectRouter
    .route('/projects/:myProjectId/mainImage/:imageId')
    .put(verifyAccessToken([Role.EDITOR]), connectMainImage);
projectRouter
    .route('/projects/:myProjectId/mainImage')
    .delete(verifyAccessToken([Role.EDITOR]), disconnectMainImage);

projectRouter
    .route('/projects/:myProjectId/images/:imageId')
    .put(verifyAccessToken([Role.EDITOR]), connectProjectImage)
    .delete(verifyAccessToken([Role.EDITOR]), disconnectProjectImage);

projectRouter
    .route('/projects/publish/:myProjectId')
    .put(verifyAccessToken([Role.EDITOR]), publish);

projectRouter
    .route('/projects/unpublish/:myProjectId')
    .put(verifyAccessToken([Role.EDITOR]), unpublish);

export { projectRouter };
