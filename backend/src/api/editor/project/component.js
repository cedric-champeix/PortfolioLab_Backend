const app = require("express")
const {verifyAccessToken, Roles} = require("../../../service/auth/jwt");
const {updateComponent, deleteComponent, createComponent, moveComponent} = require("../../../service/editor/project/component");

let router = new app.Router()

router.route("/projects/:myProjectId/components")
    .post(verifyAccessToken([Roles.Editor]), createComponent)

router.route("/projects/:myProjectId/components/:componentId")
    .put(verifyAccessToken([Roles.Editor]), updateComponent)
    .delete(verifyAccessToken([Roles.Editor]), deleteComponent)

router.route("/projects/:myProjectId/components/:componentId/move")
    .put(verifyAccessToken([Roles.Editor]), moveComponent)

module.exports = router