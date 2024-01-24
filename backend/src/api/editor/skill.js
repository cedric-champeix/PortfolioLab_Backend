const app = require("express")
const {verifyAccessToken, Roles} = require("../../service/auth/jwt");
const {createSkill, deleteSkill, updateSkill, getSkill, getAllSkills} = require("../../service/editor/skill");

let router = new app.Router()

router.route("/skills")
    .get(verifyAccessToken([Roles.Editor]), getAllSkills)
    .post(verifyAccessToken([Roles.Editor]), createSkill)

router.route("/skills/:skillId")
    .get(verifyAccessToken([Roles.Editor]), getSkill)
    .put(verifyAccessToken([Roles.Editor]), updateSkill)
    .delete(verifyAccessToken([Roles.Editor]), deleteSkill)


module.exports = router