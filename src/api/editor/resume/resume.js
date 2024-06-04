const app = require("express")
const {
    getResume, getFullResume, updateResume, resetResume, connectImage, disconnectImage, connectSkill, disconnectSkill, connectSocial, disconnectSocial,
    publish,
    unpublish
} = require("../../../service/editor/resume/resume")
const {verifyAccessToken, Roles} = require("../../../service/auth/jwt")

let router = new app.Router()

router.route('/resume')
    .get(verifyAccessToken([Roles.Editor]), getResume)
    .put(verifyAccessToken([Roles.Editor]), updateResume)
    .delete(verifyAccessToken([Roles.Editor]), resetResume)

router.route('/resume/preview')
    .get(verifyAccessToken([Roles.Editor]), getFullResume)

router.route('/resume/image/:imageId')
    .put(verifyAccessToken([Roles.Editor]), connectImage)

router.route('/resume/image')
    .delete(verifyAccessToken([Roles.Editor]), disconnectImage)

router.route('/resume/skills/:skillId')
    .put(verifyAccessToken([Roles.Editor]), connectSkill)
    .delete(verifyAccessToken([Roles.Editor]), disconnectSkill)

router.route('/resume/socials/:contactId')
    .put(verifyAccessToken([Roles.Editor]), connectSocial)
    .delete(verifyAccessToken([Roles.Editor]), disconnectSocial)

router.route('/resume/publish')
    .put(verifyAccessToken([Roles.Editor]), publish)

router.route('/resume/unpublish')
    .put(verifyAccessToken([Roles.Editor]), unpublish)

module.exports = router