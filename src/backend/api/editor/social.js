const app = require("express")
const {verifyAccessToken, Roles} = require("../../utils/jwt");
const {getAllSocials, getSocial, updateSocial, deleteSocial, createSocial} = require("../../service/editor/social");

let router = new app.Router()

router.route("/socials")
    .get(verifyAccessToken([Roles.Editor]), getAllSocials)

router.route("/social/:socialId")
    .get(verifyAccessToken([Roles.Editor]), getSocial)
    .put(verifyAccessToken([Roles.Editor]), updateSocial)
    .delete(verifyAccessToken([Roles.Editor]), deleteSocial)

router.route("/social")
    .post(verifyAccessToken([Roles.Editor]), createSocial)

module.exports = router