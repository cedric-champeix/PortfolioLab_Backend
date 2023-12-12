const app = require("express")
const {
    getResume, updateResume, resetResume, uploadImage, deleteImage, connectSkill, disconnectSkill, connectSocial, disconnectSocial
} = require("../../service/editor/resume");
const {verifyAccessToken, Roles} = require("../../service/auth/jwt");
const {uploadResumeImage} = require("../../service/file_upload/upload")

let router = new app.Router()

router.route('/resume')
    .get(verifyAccessToken([Roles.Editor]), getResume)
    .put(verifyAccessToken([Roles.Editor]), updateResume)
    .delete(verifyAccessToken([Roles.Editor]), resetResume)

router.route('/resume/image')
    .post(verifyAccessToken([Roles.Editor]), uploadResumeImage.single(), uploadImage)
    .delete(verifyAccessToken([Roles.Editor]), deleteImage)

router.route('/resume/skill/:skillId')
    .put(verifyAccessToken([Roles.Editor]), connectSkill)
    .delete(verifyAccessToken([Roles.Editor]), disconnectSkill)

router.route('/resume/social/:contactId')
    .put(verifyAccessToken([Roles.Editor]), connectSocial)
    .delete(verifyAccessToken([Roles.Editor]), disconnectSocial)

module.exports = router