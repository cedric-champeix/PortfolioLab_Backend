const app = require('express')
const {verifyAccessToken, Roles} = require("../../utils/jwt");
const {connectSkill, disconnectSkill, getAllProjects, createProject, getProject, updateProject, deleteProject} = require("../../service/editor/project");

let router = new app.Router()

router.route('/projects')
    .get(verifyAccessToken([Roles.Editor]), getAllProjects)

router.route('/project')
    .post(verifyAccessToken([Roles.Editor]), createProject)

router.route('/project/:myProjectId')
    .get(verifyAccessToken([Roles.Editor]), getProject)
    .put(verifyAccessToken([Roles.Editor]), updateProject)
    .delete(verifyAccessToken([Roles.Editor]), deleteProject)


router.route('/project/:myProjectId/skill/:skillId')
    .put(verifyAccessToken([Roles.Editor]), connectSkill)
    .delete(verifyAccessToken([Roles.Editor]), disconnectSkill)

module.exports = router