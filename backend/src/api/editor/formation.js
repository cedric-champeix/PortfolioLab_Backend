const app = require("express")
const {verifyAccessToken, Roles} = require("../../service/auth/jwt");
const {getAllFormations, getFormations, createFormation, updateFormation, deleteFormation} = require("../../service/editor/formation");

let router = new app.Router()

router.route("/formations")
    .get(verifyAccessToken([Roles.Editor]), getAllFormations)

router.route("/formation/:formationId")
    .get(verifyAccessToken([Roles.Editor]), getFormations)
    .put(verifyAccessToken([Roles.Editor]), updateFormation)
    .delete(verifyAccessToken([Roles.Editor]), deleteFormation)

router.route("/formation")
    .post(verifyAccessToken([Roles.Editor]), createFormation)

module.exports = router