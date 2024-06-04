const app = require("express")
const {verifyAccessToken, Roles} = require("../../../service/auth/jwt");
const {getAllHobbies, getHobby, updateHobby, deleteHobby, createHobby} = require("../../../service/editor/resume/hobby");

let router = new app.Router()

router.route("/hobbies")
    .get(verifyAccessToken([Roles.Editor]), getAllHobbies)
    .post(verifyAccessToken([Roles.Editor]), createHobby)

router.route("/hobbies/:hobbyId")
    .get(verifyAccessToken([Roles.Editor]), getHobby)
    .put(verifyAccessToken([Roles.Editor]), updateHobby)
    .delete(verifyAccessToken([Roles.Editor]), deleteHobby)

module.exports = router