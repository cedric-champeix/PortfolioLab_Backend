const app = require("express")
const {verifyAccessToken, Roles} = require("../../service/auth/jwt");
const {getAllLanguages, getLanguage, updateLanguage, deleteLanguage, createLanguage} = require("../../service/editor/language");

let router = new app.Router()

router.route("/languages")
    .get(verifyAccessToken([Roles.Editor]), getAllLanguages)
    .post(verifyAccessToken([Roles.Editor]), createLanguage)

router.route("/languages/:languageId")
    .get(verifyAccessToken([Roles.Editor]), getLanguage)
    .put(verifyAccessToken([Roles.Editor]), updateLanguage)
    .delete(verifyAccessToken([Roles.Editor]), deleteLanguage)

module.exports = router