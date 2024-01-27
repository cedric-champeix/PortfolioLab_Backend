const app = require('express')
const {verifyAccessToken, Roles} = require("../../../service/auth/jwt");
const {connectSkill, disconnectSkill, getAllProjects, createProject, getProject, updateProject, deleteProject} = require("../../../service/editor/project/project");
const {uploadProjectMainImage} = require("../../../service/file_upload/upload")

let router = new app.Router()

router.route('/projects')
    .get(verifyAccessToken([Roles.Editor]), getAllProjects)
    .post(verifyAccessToken([Roles.Editor]), uploadProjectMainImage.single("projectImg"), createProject)

router.route('/projects/:myProjectId')
    .get(verifyAccessToken([Roles.Editor]), getProject)
    .put(verifyAccessToken([Roles.Editor]), uploadProjectMainImage.single("projectImg"), updateProject)
    .delete(verifyAccessToken([Roles.Editor]), deleteProject)

router.route('/projects/:myProjectId/skills/:skillId')
    .put(verifyAccessToken([Roles.Editor]), connectSkill)
    .delete(verifyAccessToken([Roles.Editor]), disconnectSkill)


module.exports = router