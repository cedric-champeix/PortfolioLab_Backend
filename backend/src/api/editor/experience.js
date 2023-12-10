const app = require("express")
const {verifyAccessToken, Roles} = require("../../service/auth/jwt");
const {getAllExperience, getExperience, createExperience, updateExperience, deleteExperience} = require("../../service/editor/experience");

let router = new app.Router()

router.route("/experiences")
    .get(verifyAccessToken([Roles.Editor]), getAllExperience)

router.route("/experience/:experienceId")
    .get(verifyAccessToken([Roles.Editor]), getExperience)
    .put(verifyAccessToken([Roles.Editor]), updateExperience)
    .delete(verifyAccessToken([Roles.Editor]), deleteExperience)

router.route("/experience")
    .post(verifyAccessToken([Roles.Editor]), createExperience)

module.exports = router