const app = require('express')
const {getImages, addImage, deleteMultipleImages, deleteImage, updateImage} = require("../../service/editor/image")
const {verifyAccessToken, Roles} = require("../../service/auth/jwt");
const {uploadImage} = require("../../service/file_upload/upload");

let router = new app.Router()

router.route('/images')
    .get(verifyAccessToken([Roles.Editor]), getImages)
    .delete(verifyAccessToken([Roles.Editor]), deleteMultipleImages)

router.route('/images/:imageId')
    .put(verifyAccessToken([Roles.Editor]), updateImage)
    .delete(verifyAccessToken([Roles.Editor]), deleteImage)

router.route('/images')
    .post(verifyAccessToken([Roles.Editor]), uploadImage.single("image"), addImage)

module.exports = router