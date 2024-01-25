const app = require("express")
const {verifyAccessToken, Roles} = require("../../../service/auth/jwt");
const {getAllFormations, getFormations, createFormation, updateFormation, deleteFormation} = require("../../../service/editor/resume/formation");

let router = new app.Router()

router.route("/formations")
    .get(verifyAccessToken([Roles.Editor]), getAllFormations)
    .post(verifyAccessToken([Roles.Editor]), createFormation)

router.route("/formations/:formationId")
    .get(verifyAccessToken([Roles.Editor]), getFormations)
    .put(verifyAccessToken([Roles.Editor]), updateFormation)
    .delete(verifyAccessToken([Roles.Editor]), deleteFormation)

module.exports = router