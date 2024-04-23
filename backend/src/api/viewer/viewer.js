const app = require("express")
const {getInformation, getResume, getProjects} = require("../../service/viewer")

let router = new app.Router()

router.route("/resume/:username").get(getResume)
router.route("/projects/:userId").get(getProjects)

module.exports = router