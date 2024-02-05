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
    connectProjectImage,
    disconnectProjectImage
} = require("../../../service/editor/project/project");
const {uploadProjectMainImage} = require("../../../service/file_upload/upload")

let router = new app.Router()

router.route('/projects')
    .get(verifyAccessToken([Roles.Editor]), getAllProjects)
    .post(verifyAccessToken([Roles.Editor]), uploadProjectMainImage.single("projectMainImage"), createProject)

router.route('/projects/:myProjectId')
    .get(verifyAccessToken([Roles.Editor]), getProject)
    .put(verifyAccessToken([Roles.Editor]), uploadProjectMainImage.single("projectMainImage"), updateProject)
    .delete(verifyAccessToken([Roles.Editor]), deleteProject)

router.route('/projects/:myProjectId/skills/:skillId')
    .put(verifyAccessToken([Roles.Editor]), connectSkill)
    .delete(verifyAccessToken([Roles.Editor]), disconnectSkill)

router.route('/projects/:myProjectId/images/:imageId')
    .put(verifyAccessToken([Roles.Editor]), connectProjectImage)
    .delete(verifyAccessToken([Roles.Editor]), disconnectProjectImage)


module.exports = router