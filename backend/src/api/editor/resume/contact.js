const app = require("express")
const {verifyAccessToken, Roles} = require("../../../service/auth/jwt");
const {getAllContacts, getContact, updateContact, deleteContact, createContact} = require("../../../service/editor/contact");

let router = new app.Router()

router.route("/contacts")
    .get(verifyAccessToken([Roles.Editor]), getAllContacts)
    .post(verifyAccessToken([Roles.Editor]), createContact)

router.route("/contacts/:contactId")
    .get(verifyAccessToken([Roles.Editor]), getContact)
    .put(verifyAccessToken([Roles.Editor]), updateContact)
    .delete(verifyAccessToken([Roles.Editor]), deleteContact)


module.exports = router