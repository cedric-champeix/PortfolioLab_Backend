const app = require("express")
const {getResume, updateResume, resetResume} = require("../../service/editor/resume");
const {verifyAccessToken, Roles} = require("../../utils/jwt");

let router = new app.Router()

router.route('/resume')
    .get(verifyAccessToken([Roles.Editor]), getResume)
    .put(verifyAccessToken([Roles.Editor]), updateResume)
    .delete(verifyAccessToken([Roles.Editor]), resetResume)

module.exports = router