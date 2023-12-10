const app = require("express")
const {verifyAccessToken, Roles} = require("../../service/auth/jwt");
const {getAllContacts, getContact, updateContact, deleteContact, createContact} = require("../../service/editor/contact");

let router = new app.Router()

router.route("/contacts")
    .get(verifyAccessToken([Roles.Editor]), getAllContacts)

router.route("/contact/:contactId")
    .get(verifyAccessToken([Roles.Editor]), getContact)
    .put(verifyAccessToken([Roles.Editor]), updateContact)
    .delete(verifyAccessToken([Roles.Editor]), deleteContact)

router.route("/contact")
    .post(verifyAccessToken([Roles.Editor]), createContact)

module.exports = router