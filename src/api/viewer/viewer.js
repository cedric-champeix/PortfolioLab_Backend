const app = require("express")
const {getResume, getPortfolio, getProject} = require("../../service/viewer")

let router = new app.Router()

router.route("/:username/resume").get(getResume)

router.route("/:username/projects").get(getPortfolio)
router.route("/:username/projects/:projectId").get(getProject)

module.exports = router