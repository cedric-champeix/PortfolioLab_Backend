const app = require("express")
const {verifyAccessToken, Roles} = require("../../utils/jwt");
const {createSkill, deleteSkill, updateSkill, getSkill, getAllSkills} = require("../../service/editor/skill");

let router = new app.Router()

router.route("/skills")
    .get(verifyAccessToken([Roles.Editor]), getAllSkills)

router.route("/skill/:skillId")
    .get(verifyAccessToken([Roles.Editor]), getSkill)
    .put(verifyAccessToken([Roles.Editor]), updateSkill)
    .delete(verifyAccessToken([Roles.Editor]), deleteSkill)

router.route("/skill")
    .post(verifyAccessToken([Roles.Editor]), createSkill)

module.exports = router