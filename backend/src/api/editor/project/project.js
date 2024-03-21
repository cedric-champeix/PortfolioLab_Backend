const app = require('express')
const {verifyAccessToken, Roles} = require("../../../service/auth/jwt");
const {
    connectSkill,
    disconnectSkill,
    getAllProjects,
    createProject,
    getProject,
    updateProject,
    deleteProject,
    connectMainImage,
    disconnectMainImage,
    connectProjectImage,
    disconnectProjectImage,
    publish,
    unpublish
} = require("../../../service/editor/project/project");

let router = new app.Router()

router.route('/projects')
    .get(verifyAccessToken([Roles.Editor]), getAllProjects)
    .post(verifyAccessToken([Roles.Editor]), createProject)

router.route('/projects/:myProjectId')
    .get(verifyAccessToken([Roles.Editor]), getProject)
    .put(verifyAccessToken([Roles.Editor]), updateProject)
    .delete(verifyAccessToken([Roles.Editor]), deleteProject)

router.route('/projects/:myProjectId/skills/:skillId')
    .put(verifyAccessToken([Roles.Editor]), connectSkill)
    .delete(verifyAccessToken([Roles.Editor]), disconnectSkill)


router.route('/projects/:myProjectId/mainImage/:imageId')
    .put(verifyAccessToken([Roles.Editor]), connectMainImage)
router.route('/projects/:myProjectId/mainImage')
    .delete(verifyAccessToken([Roles.Editor]), disconnectMainImage)

router.route('/projects/:myProjectId/images/:imageId')
    .put(verifyAccessToken([Roles.Editor]), connectProjectImage)
    .delete(verifyAccessToken([Roles.Editor]), disconnectProjectImage)


router.route('/projects/publish/:myProjectId')
    .put(verifyAccessToken([Roles.Editor]), publish)

router.route('/projects/unpublish/:myProjectId')
    .put(verifyAccessToken([Roles.Editor]), unpublish)

module.exports = router